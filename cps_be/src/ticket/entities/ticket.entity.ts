import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tag } from "./tag.entity";
import { Department } from "src/user/entities/Department.entity";
import { User } from "src/user/entities/user.entity";
import { Message } from "./message.entity";
import { TicketType } from "./Type.entity";
import { TicketLog } from "./log.entity";

export enum TicketStatus {
  NEW = "NEW",
  OPEN = "OPEN",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum TicketPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

@Entity({name: "ticket"})
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    subject: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "enum", enum: TicketStatus, default: TicketStatus.NEW })
    status: TicketStatus;

    @Column({ type: "enum", enum: TicketPriority, default: TicketPriority.NORMAL })
    priority: TicketPriority;

    @ManyToOne(() => User, (user) => user.tickets, { nullable: true, onDelete: "SET NULL" })
    from: User;

    @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true, onDelete: "SET NULL" })
    assignee: User;

    @ManyToOne(() => Department, (department) => department.tickets, { nullable: true, onDelete: "SET NULL" })
    department: Department;

    @OneToMany(() => Message, (message) => message.ticket)
    messages: Message[];

    @OneToMany(() => TicketLog, (log) => log.ticket, {cascade: true})
    logs: TicketLog[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: "timestamp", nullable: true })
    firstResponseAt: Date;

    @Column({ type: "timestamp", nullable: true })
    resolvedAt: Date;

    @Column({ type: "int", nullable: true })
    resolutionTimeMinutes: number; // (auto-calc on close)

    @ManyToMany(() => Tag, (tag) => tag.tickets)
    @JoinTable()
    tags: Tag[];

    @ManyToOne(() => TicketType, (type) => type.tickets, { nullable: true })
    type: TicketType;
}
