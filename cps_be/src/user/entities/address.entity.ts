import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Branch } from "./branch.entity";

export enum AddressType {
    HOME = 'HOME',
    OFFICE = 'OFFICE',
}

@Entity({name: "address"})
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "uuid", unique:true})
    addressId: string

    @Column({default: AddressType.HOME})
    addressType:AddressType

    @Column({nullable:true})
    state:string

    @Column({nullable:true})
    phone:string

    @Column({nullable:true})
    city:string

    @Column({nullable:true})
    country:string

    @Column()
    addressLineOne:string

    @Column({nullable:true})
    addressLineTwo:string

    @Column({nullable:true})
    landmark:string

    @ManyToOne(()=> User, (user)=> user.addresses)
    @JoinColumn({ name: 'user' })
    user?: User

    @OneToOne(()=> Branch, (branch)=> branch.address)
    branch?: Branch
}
