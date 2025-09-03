import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthHistory } from 'src/ticket/entities/MonthHistory.entity';
import { YearHistory } from 'src/ticket/entities/YearHistory.entity';
import { JwtService } from '@nestjs/jwt';
import { UserMonthHistory } from 'src/ticket/entities/UserMonthHistory.entity';
import { UserYearHistory } from 'src/ticket/entities/UserYearHistory.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthHistory, YearHistory, UserMonthHistory, UserYearHistory, Ticket])],
  controllers: [StatsController],
  providers: [StatsService, JwtService],
})
export class StatsModule {}
