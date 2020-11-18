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

export interface IItem {
   id?: number
   name : string
   price:number
   image?: string
   rating:number
   createdOn?: Date
   updatedOn?: Date
}

@Entity()
export class Item {

   // constructor(param : IItem){
   //    this.name = param.name
   //    this.price = param.price
   // }

   @PrimaryGeneratedColumn()
   id! : number
   
   @Column()
   name! : string;

   @Column()
   price! : number;
   
   @Column()
   image? : string;
   
   @Column({default :0})
   rating? : number = 0;
   
   @CreateDateColumn()
   createdOn : Date;
   
   @UpdateDateColumn()
   updatedOn : Date;

   @ManyToOne(type => Restaurant, restauran => restauran.item)
   restauran: Restaurant

   @ManyToMany(type => Review, review => review.item, {cascade:true})
   @JoinTable()
   review : Review;
   
}