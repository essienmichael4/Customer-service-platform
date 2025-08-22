import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, CreateTicketTypeDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @User() user:UserInfo) {
    return this.ticketService.create(createTicketDto, user.sub.id);
  }

  // @UseGuards(JwtGuard)
  @Post("types")
  createTicketType(@Body() createTicketTypeDto: CreateTicketTypeDto) {
    return this.ticketService.createTicketType(createTicketTypeDto);
  }

  @UseGuards(JwtGuard)
  @Get("user")
  findAllTickets(@Query() pageOptionsDto:PageOptionsDto, @User() user:UserInfo) {
    return this.ticketService.findAllTickets(pageOptionsDto, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get("user/:id")
  findAllUserTickets(@Param('id', ParseIntPipe) id: number, @Query() pageOptionsDto:PageOptionsDto) {
    return this.ticketService.findAllTickets(pageOptionsDto, id);
  }

  @UseGuards(JwtGuard)
  @Get("admin")
  findAllTicketsForAdmin(@Query() pageOptionsDto:PageOptionsDto,) {
    return this.ticketService.findAllTickets(pageOptionsDto);
  }

  @Get("/types")
  findAllTicketTypes() {
    return this.ticketService.findAllTicketTypes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
