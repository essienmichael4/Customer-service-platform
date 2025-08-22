import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    try{
      const userEntity = this.userRepo.create()
      const saveEntity = {
        ...userEntity,
        ...createUserDto,
        userId: v4(),
        password: await this.hashPassword(createUserDto.password),
        name: createUserDto.name,
        searchName: createUserDto.name.toLowerCase(),
        email: createUserDto.email.toLowerCase()  
      }

      const user = await this.userRepo.save(saveEntity)
      return user
    }catch(err){
      throw err
    }
  }

  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findAll(pageOptionsDto:PageOptionsDto) {
    const clients = await this.userRepo.findAndCount({
      order:{
        id: "DESC"
      },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip
    })

    // const ticketsResponse = clients[0].map(ticket=> new TicketResponseDto(ticket))
    
      const pageMetaDto = new PageMetaDto({itemCount: clients[1], pageOptionsDto})
      return new PageDto(clients[0], pageMetaDto)
  }

  async findAllClients() {
    return await this.userRepo.find({
      where: {
        role: Role.USER
      }
    })
  }

  async findAllAdmins() {
    return await this.userRepo.find({
      where: {
        role: Role.ADMIN
      }
    })
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({
      where: {
        id
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async resetPassword(id: number, password:string) {
    try{
      return await this.userRepo.update(id, {
        password: await this.hashPassword(password)
      })
    }catch(err){
      throw err
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }
}
