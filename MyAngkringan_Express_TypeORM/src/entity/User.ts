import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, UpdateDateColumn, OneToOne, Index, JoinColumn } from "typeorm";
import { IsNotEmpty, Length } from 'class-validator';
import * as bcrypt from 'bcryptjs'
import { Restaurant } from './Restaurant';
import { Profile } from './Profile';

export type UserRoleType = "admin" | "manager" | "customer"

export interface IUser {
    id?: number;
    username: string;
    password: string;
    email: string;
    role: UserRoleType;
    createdAt?: Date;
    updatedAt?: Date;
    restaurant?: Restaurant;
    profile?: Profile;
}
@Entity()
export class User {

    // constructor(param : IUser){
    //     this.username = param.username
    //     this.password = param.password
    //     this.role = param.role ?? "customer"
    // }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "string", length: 64, })
    @Index({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: "string", length: 128, })
    @Index({ unique: true })
    email: string;

    @Column({
        type: "enum",
        enum: ["admin", "manager", "customer"],
        default: "customer"
    })
    @IsNotEmpty()
    role: UserRoleType

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(type => Restaurant, { cascade: true, nullable: true, onDelete: "CASCADE" })
    @JoinColumn()
    restaurant: Restaurant;

    @OneToOne(type => Profile, { cascade: true, nullable: true, onDelete: "CASCADE" })
    @JoinColumn()
    profile: Profile;

    @Column()
    profileId: number;

    public hashPassword(password:string) {
        this.password = bcrypt.hashSync(password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}
