import { User } from './User';
import { JoinColumn } from 'typeorm';
import { OneToOne } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { Restaurant } from './Restaurant';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { type } from 'os';
import { Review } from './Review';
import { Item } from './Item';

export interface ICart {
   id?: number
   qty : string
   createdOn?: Date
   updatedOn?: Date
   userId?: number
   itemId?: number
}

@Entity()
export class Cart {

   // constructor(param : IItem){
   //    this.name = param.name
   //    this.price = param.price
   // }

   @PrimaryGeneratedColumn()
   id! : number
   
   @Column()
   qty! : string;
   
   @CreateDateColumn()
   createdOn : Date;
   
   @UpdateDateColumn()
   updatedOn : Date;

   @Column({nullable: true})
   userId : number;

   @OneToOne(type => User, { cascade: true })
   @JoinColumn()
   user: User;

   @Column({nullable: true})
   itemId : number;

   @OneToOne(type => Item, { cascade: true })
   @JoinColumn()
   item: Item;
   
}