import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Item } from './Item';

export interface IRestaurant {
   id?: number;
   name: string
   logo: string
   description: string
   createdOn?: Date;
   updatedOn?: Date;
   item?: Item[]
}

@Entity()
export class Restaurant {

   // constructor(param : IRestaurant) {
   //    this.name = param.name
   //    this.logo = param.logo
   //    this.description = param.description
   // }

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   name: string

   @Column()
   logo: string

   @Column()
   description: string

   @CreateDateColumn()
   createdOn: Date;

   @UpdateDateColumn()
   updatedOn: Date;

   @OneToMany(type => Item, item => item.restauran, { cascade: true })
   item?: Item[]

}