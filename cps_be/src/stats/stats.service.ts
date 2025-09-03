import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthHistory } from 'src/ticket/entities/MonthHistory.entity';
import { YearHistory } from 'src/ticket/entities/YearHistory.entity';
import { Repository } from 'typeorm';
import { HistoryDataDto } from './dto/response.dto';
import { UserYearHistory } from 'src/ticket/entities/UserYearHistory.entity';
import { UserMonthHistory } from 'src/ticket/entities/UserMonthHistory.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Ticket) private readonly ticketRepo:Repository<Ticket>,
        @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
        @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
        @InjectRepository(UserMonthHistory) private readonly userMonthHistoryRepo:Repository<UserMonthHistory>,
        @InjectRepository(UserYearHistory) private readonly userYearHistoryRepo:Repository<UserYearHistory>,
    ){}

    async getPeriods(){
        const result = await this.monthHistoryRepo.createQueryBuilder("monthHistory")
            .select("DISTINCT monthHistory.year", "year") // Select distinct years
            .orderBy("monthHistory.year", "ASC")
            .getRawMany();

        const years = result.map((el: { year: any }) => el.year);
        
        if (years.length === 0) {
            return [new Date().getFullYear()]; // Return the current year if no years found
        }

        return years;
    };

    async getHistoryData (timeframe: "MONTH" | "YEAR", month:number, year:number, userId?:number){
        if(userId){
            if(timeframe === "YEAR"){
                return await this.getUserYearHistory(year)
            }
            if(timeframe === "MONTH"){
                return await this.getUserMonthHistory(month, year)
            }
        }else{
            if(timeframe === "YEAR"){
                return await this.getYearHistory(year)
            }
            if(timeframe === "MONTH"){
                return await this.getMonthHistory(month, year)
            }
        }
    }

    async getYearHistory (year: number): Promise<HistoryDataDto[]> {
        const result = this.yearHistoryRepo.createQueryBuilder("yearHistory")
        .select("yearHistory.month", "month")
        .addSelect("SUM(yearHistory.all)", "tickets")
        .addSelect("SUM(yearHistory.resolved)", "resolved")
        .where("yearHistory.year = :year", { year });

        result.groupBy("yearHistory.month")
        .orderBy("month", "ASC");

        const aggregatedResult = await result.getRawMany(); 

        if (!aggregatedResult || aggregatedResult.length === 0) return [];

        const history: HistoryDataDto[] = [];

        for (let i = 0; i < 12; i++) {
            let tickets = 0;
            let resolved = 0;
            let unresolved = 0;

            const month = aggregatedResult.find((row: { month: number }) => row.month === i);
            if (month) {
                tickets = month.tickets || 0;
                resolved = month.resolved || 0;
            }
            unresolved = tickets - resolved

            history.push({
                year,
                month: i,
                tickets,
                resolved,
                unresolved
            });
        }

        return history;
    }

    async getMonthHistory(month: number, year: number): Promise<HistoryDataDto[]>{
        const result = this.monthHistoryRepo.createQueryBuilder("monthHistory")
        .select("monthHistory.day", "day")
        .addSelect("SUM(monthHistory.all)", "tickets")
        .addSelect("SUM(monthHistory.resolved)", "resolved")
        .where("monthHistory.month = :month", { month })
        .andWhere("monthHistory.year = :year", { year });

        result.groupBy("monthHistory.day")
            .orderBy("day", "ASC");

        const aggregatedResult = await result.getRawMany();

        if (!aggregatedResult || aggregatedResult.length === 0) return [];

            const history: HistoryDataDto[] = [];
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in month

            for (let i = 1; i <= daysInMonth; i++) {
            let tickets = 0;
            let resolved = 0;
            let unresolved = 0;

            const dayData = aggregatedResult.find((row: { day: number }) => row.day === i);
            if (dayData) {
                tickets = dayData.tickets || 0;
                resolved = dayData.resolved || 0;  
            }
            unresolved = tickets - resolved

            history.push({
                year,
                month,
                day: i,
                tickets,
                resolved,
                unresolved
            });
        }

        return history;
    }

    async getUserYearHistory (year: number, userId?:number): Promise<HistoryDataDto[]> {
        const result = this.userYearHistoryRepo.createQueryBuilder("yearHistory")
        .select("yearHistory.month", "month")
        .addSelect("SUM(yearHistory.all)", "tickets")
        .addSelect("SUM(yearHistory.resolved)", "resolved")
        .where("yearHistory.year = :year", { year });

        if (userId) {
            result.andWhere("yearHistory.userId = :userId", { userId });
        }

        result.groupBy("yearHistory.month")
        .orderBy("month", "ASC");

        const aggregatedResult = await result.getRawMany(); 

        if (!aggregatedResult || aggregatedResult.length === 0) return [];

        const history: HistoryDataDto[] = [];

        for (let i = 0; i < 12; i++) {
            let tickets = 0;
            let resolved = 0;
            let unresolved = 0;

            const month = aggregatedResult.find((row: { month: number }) => row.month === i);
            if (month) {
                tickets = month.tickets || 0;
                resolved = month.resolved || 0;
            }
            unresolved = tickets - resolved

            history.push({
                year,
                month: i,
                tickets,
                resolved,
                unresolved
            });
        }

        return history;
    }

    async getUserMonthHistory(month: number, year: number, userId?:number): Promise<HistoryDataDto[]>{
        const result = this.userMonthHistoryRepo.createQueryBuilder("monthHistory")
        .select("monthHistory.day", "day")
        .addSelect("SUM(monthHistory.all)", "tickets")
        .addSelect("SUM(monthHistory.resolved)", "resolved")
        .where("monthHistory.month = :month", { month })
        .andWhere("monthHistory.year = :year", { year });
        if (userId) {
            result.andWhere("monthHistory.userId = :userId", { userId });
        }

        result.groupBy("monthHistory.day")
            .orderBy("day", "ASC");

        const aggregatedResult = await result.getRawMany();

        if (!aggregatedResult || aggregatedResult.length === 0) return [];

            const history: HistoryDataDto[] = [];
            const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in month

            for (let i = 1; i <= daysInMonth; i++) {
            let tickets = 0;
            let resolved = 0;
            let unresolved = 0;

            const dayData = aggregatedResult.find((row: { day: number }) => row.day === i);
            if (dayData) {
                tickets = dayData.tickets || 0;
                resolved = dayData.resolved || 0;  
            }
            unresolved = tickets - resolved

            history.push({
                year,
                month,
                day: i,
                tickets,
                resolved,
                unresolved
            });
        }

        return history;
    }

    async getStatistics(from?: Date, to?: Date, userId?: number){
        const tickets = await this.totalTickets(from, to, userId)
        const unresolved = await this.totalUnresolvedTickets(from, to,userId)
        
        return {tickets, unresolved, resolved: tickets - unresolved}
    }

    async totalTickets(from?: Date, to?: Date, userId?: number) {
        const query = this.ticketRepo
            .createQueryBuilder("ticket")
            .select("COUNT(ticket.id)", "count")
            // .where("ticket.status IN (:...statuses)", { statuses: ["CLOSED", "RESOLVED"] });

        if (userId) {
            query.andWhere("ticket.fromId = :userId", { userId });
            // If you want by assignee instead, use: query.andWhere("ticket.assigneeId = :userId", { userId });
        }

        if (from) {
            query.andWhere("ticket.createdAt >= :from", { from });
        }

        if (to) {
            query.andWhere("ticket.createdAt <= :to", { to });
        }

        const result = await query.getRawOne<{ count: string }>();
        return Number(result.count);
    }


    async totalUnresolvedTickets(from?: Date, to?: Date, userId?: number) {
        const query = this.ticketRepo
            .createQueryBuilder("ticket")
            .select("COUNT(ticket.id)", "count")
            .where("ticket.status IN (:...statuses)", { statuses: ["NEW", "OPEN", "PENDING"] });

        if (userId) {
            query.andWhere("ticket.fromId = :userId", { userId });
            // or use "ticket.assigneeId = :userId" if you want unresolved tickets assigned to them
        }

        if (from) {
            query.andWhere("ticket.createdAt >= :from", { from });
        }

        if (to) {
            query.andWhere("ticket.createdAt <= :to", { to });
        }

        const result = await query.getRawOne<{ count: string }>();
        return Number(result.count);
    }

}
