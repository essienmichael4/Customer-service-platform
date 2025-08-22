import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Generated } from "typeorm";
import { Ticket } from "./ticket.entity";

@Entity()
export class TicketType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", unique: true })
    @Generated("uuid")
    typeId: string;

    @Column({ unique: true })
    name: string; // e.g. "Incident", "Question", "Complaint"

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Ticket, (ticket) => ticket.type)
    tickets: Ticket[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}