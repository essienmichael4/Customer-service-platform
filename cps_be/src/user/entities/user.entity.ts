import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./address.entity";
import { Department } from "./Department.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPERADMIN = 'SUPERADMIN'
}

@Entity({name: "user"})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    userId: string

    @Column()
    name:string

    @Column({nullable: true})
    searchName:string
    
    @Column({ unique: true })
    email:string

    @Column({ nullable:true })
    phone:string

    @Column()
    password:string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: Deleted.FALSE })
    isDeleted: Deleted;

    @Column({ default: Role.USER })
    role: Role;

    @OneToMany(()=> Address, (address)=> address.user, {cascade: true})
    addresses: Address[]

    @OneToMany(()=> Department, (department)=> department.user, {cascade: true})
    departments: Department[]
}
