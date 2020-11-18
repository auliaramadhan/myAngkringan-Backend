import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, UpdateDateColumn, OneToOne, Index, JoinColumn} from "typeorm";
import { IsNotEmpty, Length } from 'class-validator';

export type UserRoleType = "admin" | "manager" | "customer"

export interface IProfile {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string
    photo?: string
    createdAt: Date;
    updatedAt: Date;
}

@Entity()
// @Unique(['username'])
export class Profile {

    // constructor(param : IProfile){
    //     this.firstName = param.firstName
    //     this.lastName = param.lastName
    //     this.phoneNumber = param.phoneNumber
    //  }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"string", length:64, })
    @IsNotEmpty()
    firstName: string;

    @Column({type:"string", length:64, })
    @IsNotEmpty()
    lastName: string;

    @Column({length:16})
    @IsNotEmpty()
    phoneNumber: string

    @Column()
    photo?: string

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
