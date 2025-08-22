import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class UserMonthHistory {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    day: number;

    @PrimaryColumn()
    month: number;

    @PrimaryColumn()
    year: number;

    @Column({ default:0 })
    all: number;

    @Column({ default:0 })
    resolved: number;
}
