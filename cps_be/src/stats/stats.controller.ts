import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatiticsRequestDto, StatsHistoryDto } from './dto/request.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('history-periods')
  historyPeriods() {
    return this.statsService.getPeriods();
  }

  @Get('admin-history')
  adminHistory(@Query() statsHistoryDto:StatsHistoryDto) {
    return this.statsService.getHistoryData(statsHistoryDto.timeframe, statsHistoryDto.month, statsHistoryDto.year);
  }

  @Get('admin-stats')
  adminStats(@Query() statisticsRequest: StatiticsRequestDto) {
    return this.statsService.getStatistics(new Date(statisticsRequest.from), new Date(statisticsRequest.to));
  }

  @UseGuards(JwtGuard)
  @Get('user-history')
  userHistory(@Query() statsHistoryDto:StatsHistoryDto, @User() user:UserInfo) {
    return this.statsService.getHistoryData(statsHistoryDto.timeframe, statsHistoryDto.month, statsHistoryDto.year, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get('user-stats')
  userStats(@Query() statisticsRequest: StatiticsRequestDto, @User() user:UserInfo) {
    return this.statsService.getStatistics(new Date(statisticsRequest.from), new Date(statisticsRequest.to), user.sub.id);
  }
}
