import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class UserYearHistory {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    month: number;

    @PrimaryColumn()
    year: number;

    @Column({ default:0 })
    all: number;

    @Column({ default:0 })
    resolved: number;
}
