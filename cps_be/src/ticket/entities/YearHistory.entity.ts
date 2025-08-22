import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity({name: "yearHistory"})
export class YearHistory {
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
