import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Tag } from './entities/tag.entity';
import { Message } from './entities/message.entity';
import { TicketType } from './entities/Type.entity';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/user/entities/Department.entity';
import { YearHistory } from './entities/YearHistory.entity';
import { MonthHistory } from './entities/MonthHistory.entity';
import { UserMonthHistory } from './entities/UserMonthHistory.entity';
import { UserYearHistory } from './entities/UserYearHistory.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Tag, Message, TicketType, User, Department, YearHistory, MonthHistory, UserMonthHistory, UserYearHistory])],
  controllers: [TicketController],
  providers: [TicketService, JwtService],
})
export class TicketModule {}
