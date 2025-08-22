import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.entity";

@Entity({name: "tag"})
export class Tag {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "uuid", unique: true })
    @Generated("uuid")
    tagId: string;

    @Column({unique:true})
    name:string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => Ticket, (ticket) => ticket.tags, { cascade: true })
    tickets: Ticket[];
}