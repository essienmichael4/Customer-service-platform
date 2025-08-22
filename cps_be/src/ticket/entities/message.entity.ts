import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Ticket } from "./ticket.entity";

export enum MessageAuthorType {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  SYSTEM = "SYSTEM",
}

export enum MessageKind {
  PUBLIC = "PUBLIC",
  INTERNAL = "INTERNAL",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages)
  ticket: Ticket;

  @ManyToOne(() => User, (user) => user.messages, { nullable: true })
  authorUser: User;

  @Column({ type: "enum", enum: MessageAuthorType })
  authorType: MessageAuthorType;

  @Column({ type: "enum", enum: MessageKind, default: MessageKind.PUBLIC })
  kind: MessageKind;

  @Column({ type: "text" })
  body: string;

  @CreateDateColumn()
  createdAt: Date;
}
