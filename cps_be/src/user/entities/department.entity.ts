import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "department"})
export class Department {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    departmentId: string

    @Column()
    name:string

    @Column({nullable: true})
    searchName:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @ManyToOne(()=> User, (user)=> user.addresses)
    @JoinColumn({ name: 'user' })
    user?: User

    @OneToMany(() => Ticket, (ticket) => ticket.department)
    tickets: Ticket[];
}
