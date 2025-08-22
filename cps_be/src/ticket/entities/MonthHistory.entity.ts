import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity({name: "monthHistory"})
export class MonthHistory {
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

    @Column({ default:0 })
    users: number;
}
