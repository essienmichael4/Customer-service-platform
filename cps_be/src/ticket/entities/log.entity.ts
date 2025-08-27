import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { User } from "src/user/entities/user.entity";

export enum TicketLogAction {
  CREATED = "CREATED",
  UPDATED_STATUS = "UPDATED_STATUS",
  UPDATED_TYPE = "UPDATED_TYPE",
  UPDATED_PRIORITY = "UPDATED_PRIORITY",
  ASSIGNED = "ASSIGNED",
}

@Entity()
export class TicketLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: TicketLogAction })
  action: TicketLogAction;

  @Column({ type: "text", nullable: true })
  details: string; // e.g., "Status changed from OPEN → IN_PROGRESS"

  @ManyToOne(() => Ticket, (ticket) => ticket.logs, { onDelete: "CASCADE" })
  ticket: Ticket;

  @ManyToOne(() => User, { eager: true, nullable: true })
  actor: User; // who performed the action

  @CreateDateColumn()
  createdAt: Date;
}
