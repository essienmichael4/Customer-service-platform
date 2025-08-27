import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto, CreateTicketTypeDto } from './dto/create-ticket.dto';
import { UpdateTicketDto, UpdateTicketPrioirityDto, UpdateTicketStatusDto, UpdateTicketTypeDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketPriority, TicketStatus } from './entities/ticket.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/user/entities/Department.entity';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';
import { MonthHistory } from './entities/MonthHistory.entity';
import { UserMonthHistory } from './entities/UserMonthHistory.entity';
import { UserYearHistory } from './entities/UserYearHistory.entity';
import { YearHistory } from './entities/YearHistory.entity';
import { TicketType } from './entities/Type.entity';
import { Tag } from './entities/tag.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { TicketResponseDto } from './dto/response.dto';
import { TicketLog, TicketLogAction } from './entities/log.entity';
import { Message, MessageAuthorType, MessageKind } from './entities/message.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo:Repository<Ticket>,
    @InjectRepository(TicketLog) private readonly ticketLogRepo:Repository<TicketLog>,
    @InjectRepository(TicketType) private readonly ticketTypeRepo:Repository<TicketType>,
    @InjectRepository(Tag) private readonly tagRepo:Repository<Tag>,
    @InjectRepository(Message) private readonly messageRepo:Repository<Message>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Department) private readonly departmentRepo:Repository<Department>,
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    @InjectRepository(UserMonthHistory) private readonly userMonthHistoryRepo:Repository<UserMonthHistory>,
    @InjectRepository(UserYearHistory) private readonly userYearHistoryRepo:Repository<UserYearHistory>,
    private readonly dataSource:DataSource
  ){}

  async addMessage(ticketId: number, text: string, authorId: number, kind: MessageKind): Promise<Message> {
    const ticket = await this.ticketRepo.findOneOrFail({ where: { id: ticketId } });
    const author = await this.userRepo.findOne({where: { id: authorId}})
    const authorType = author.role as unknown
    const message = this.messageRepo.create({
      ticket,
      author: author,
      authorType: authorType as MessageAuthorType,
      kind,
      body: text,
    });

    return await this.messageRepo.save(message);
  }

  async create(createTicketDto: CreateTicketDto, userId?:number) {
    const queryRunner = this.dataSource.createQueryRunner()

    try{
      await queryRunner.connect()
      await queryRunner.startTransaction()
      const user = await queryRunner.manager.findOne(User, {
        where: { id: createTicketDto.from ?? userId }
      });

      const assignee = createTicketDto.assignee
        ? await queryRunner.manager.findOne(User, { where: { id: createTicketDto.assignee } })
        : null;

      const department = createTicketDto.department
        ? await queryRunner.manager.findOne(Department, { where: { id: createTicketDto.department } })
        : null;

      // find or create ticket type
      let type = await queryRunner.manager.findOne(TicketType, {
        where: { name: createTicketDto.ticketType }
      });

      let tags = [];
      if (createTicketDto.tags?.length) {
        tags = await Promise.all(
          createTicketDto.tags.map(async (tagName) => {
            let tag = await queryRunner.manager.findOne(Tag, { where: { name: tagName } });
            if (!tag) {
              tag = queryRunner.manager.create(Tag, { name: tagName});
              tag = await queryRunner.manager.save(tag);
            }
            return tag;
          })
        );
      }

      const saveEntity = this.ticketRepo.create({
        subject: createTicketDto.topic,
        description: createTicketDto.message,
        from: user,
        ...(assignee && {assignee}),
        ...(createTicketDto.priority && {priority: createTicketDto.priority as TicketPriority}),
        ...(department && {department}),
        type,
        tags
      })

      const ticket = await this.createTicket(saveEntity, queryRunner)
      await Promise.all([
        this.createTicketLog(ticket, queryRunner, user),
        this.upsertMonthHistoryTickets(queryRunner),
        this.upsertYearHistoryTickets(queryRunner),
        this.upsertUserYearHistoryTickets(user.id, queryRunner),
        this.upsertUserMonthHistoryTickets(user.id, queryRunner),
      ]);
      
      createTicketDto.assignee && await this.addTicketAssignee(ticket, queryRunner, assignee, user)

      await queryRunner.commitTransaction()

      return ticket
    }catch(err){
      await queryRunner.rollbackTransaction()
      throw err
    }finally{
      await queryRunner.release()
    }
  }

  async createTicket(payload:Ticket, queryRunner: QueryRunner){
    return await queryRunner.manager.save(Ticket, {
      ...payload
    })
  }

  async createTicketType(createTicketTypeDto: CreateTicketTypeDto){
    return await this.ticketTypeRepo.save({name: createTicketTypeDto.name})
  }

  async createTicketLog(payload:Ticket, queryRunner: QueryRunner, actor: User){
    return await queryRunner.manager.save(TicketLog, {
      action: TicketLogAction.CREATED,
        ticket: payload,
        actor,
        details: `Ticket created with status ${payload.status}`,
    })
  }

  async addTicketAssignee(payload:Ticket, queryRunner: QueryRunner, assignee:User, actor: User){
    return await queryRunner.manager.save(TicketLog, {
      action: TicketLogAction.ASSIGNED,
      ticket: payload,
      actor,
      details: `Assigned to ${assignee.name}`,
    })
  }

  async findAllTickets(pageOptionsDto:PageOptionsDto, userId?:number) {
    const tickets = await this.ticketRepo.findAndCount({
      where: {
        ...(userId && {from: {
          id: userId
        }})
      },
      relations:{
        type: true,
        from: true
      },
      order:{
        id: "DESC"
      },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip
    })

    const ticketsResponse = tickets[0].map(ticket=> new TicketResponseDto(ticket))

    const pageMetaDto = new PageMetaDto({itemCount: tickets[1], pageOptionsDto})
    return new PageDto(ticketsResponse, pageMetaDto)
  }

  async findAllTicketTypes(){
    return await this.ticketTypeRepo.find()
  }

  findTicketDetails(id: number) {
    return this.ticketRepo.findOne({
      where: {id},
      relations: {
        type: true,
        from: true,
        assignee: true,
        messages: {
          author: true
        },
        tags: true,
        logs: {
          actor: true
        }
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  // updateTicketStatus(id: number, updateTicketStatusDto: UpdateTicketStatusDto) {
  //   return this.ticketRepo.update(id, {status: updateTicketStatusDto.status as TicketStatus});
  // }

  async updateTicketStatus(ticketId: number, updateTicketStatusDto: UpdateTicketStatusDto, userId: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId }, relations: ["logs"] });
    if (!ticket) throw new NotFoundException("Ticket not found");

    const oldStatus = ticket.status;
    ticket.status = updateTicketStatusDto.status as TicketStatus;

    // Create log
    const log = this.ticketLogRepo.create({
      ticket,
      actor: { id: userId } as any,
      action: TicketLogAction.UPDATED_STATUS,
      details: `Status changed from ${oldStatus} → ${updateTicketStatusDto.status as TicketStatus}`,
    });

    await this.ticketRepo.save(ticket);
    await this.ticketLogRepo.save(log);

    return ticket;
  }

  updateTicketType(id: number, updateTicketTypeDto: UpdateTicketTypeDto) {
    return this.ticketRepo.save({
      id, // Ticket id
      type: { id: updateTicketTypeDto.typeId } as any, // Relational field
    });
  }

  // updateTicketPriority(id: number, updateTicketPrioirityDto: UpdateTicketPrioirityDto) {
  //   return this.ticketRepo.update(id, {
  //     priority: updateTicketPrioirityDto.priority as TicketPriority
  //   });
  // }

  async updateTicketPriority(ticketId: number, updateTicketPrioirityDto: UpdateTicketPrioirityDto, userId: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId }, relations: ["logs"] });
    if (!ticket) throw new NotFoundException("Ticket not found");

    const oldPriority = ticket.priority;
    ticket.priority = updateTicketPrioirityDto.priority as TicketPriority;

    // Create log entry
    const log = this.ticketLogRepo.create({
      ticket,
      actor: { id: userId } as any,
      action: TicketLogAction.UPDATED_PRIORITY,
      details: `Priority changed from ${oldPriority} → ${updateTicketPrioirityDto.priority as TicketPriority}`,
    });

    await this.ticketRepo.save(ticket);
    await this.ticketLogRepo.save(log);

    return ticket;
  }

  async updateTicketAssignee(ticketId: number, updateTicketPrioirityDto: UpdateTicketPrioirityDto, userId: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId }, relations: ["logs"] });
    if (!ticket) throw new NotFoundException("Ticket not found");

    const oldPriority = ticket.priority;
    ticket.priority = updateTicketPrioirityDto.priority as TicketPriority;

    // Create log entry
    const log = this.ticketLogRepo.create({
      ticket,
      actor: { id: userId } as any,
      action: TicketLogAction.UPDATED_PRIORITY,
      details: `Priority changed from ${oldPriority} → ${updateTicketPrioirityDto.priority as TicketPriority}`,
    });

    await this.ticketRepo.save(ticket);
    await this.ticketLogRepo.save(log);

    return ticket;
  }

  async upsertMonthHistoryTickets(queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.monthHistoryRepo.findOne({
      where: { day, month, year }
    })

    if(monthHistory){
      monthHistory.all += 1
      return await queryRunner.manager.save(MonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.monthHistoryRepo.create({
        day, month, year, all: 1
    })
      return await queryRunner.manager.save(MonthHistory, {...newMonthHistory})
    }

  }

  async upsertYearHistoryTickets(queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.yearHistoryRepo.findOne({
      where: { month, year }
    })

    if(yearHistory){
      yearHistory.all += 1
      return await queryRunner.manager.save(YearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.yearHistoryRepo.create({
        month, year, all: 1
    })
      return await queryRunner.manager.save(YearHistory, {...newYearHistory})
    }
  }

  async upsertUserMonthHistoryTickets(userId:number, queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.userMonthHistoryRepo.findOne({
      where: { day, month, year, userId }
    })

    if(monthHistory){
      monthHistory.all += 1
      return await queryRunner.manager.save(UserMonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.userMonthHistoryRepo.create({
        day, month, year, all: 1, userId
    })
      return await queryRunner.manager.save(UserMonthHistory, {...newMonthHistory})
    }
  }

  async upsertUserYearHistoryTickets(userId:number, queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.userYearHistoryRepo.findOne({
      where: { month, year, userId }
    })

    if(yearHistory){
      yearHistory.all += 1
      return await queryRunner.manager.save(UserYearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.userYearHistoryRepo.create({
        month, year, all: 1, userId, resolved: 0
    })
      return await queryRunner.manager.save(UserYearHistory, {...newYearHistory})
    }
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
