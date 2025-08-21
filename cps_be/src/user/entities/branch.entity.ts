import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./address.entity";

export enum Deleted {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

@Entity({name: "branch"})
export class Branch {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    branchId: string

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

    @OneToOne(()=> Address, (address)=> address.branch, {cascade: true})
    @JoinColumn()
    address: Address
}
