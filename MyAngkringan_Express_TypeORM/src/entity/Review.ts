import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Item } from './Item';
import { type } from 'os';

export interface IReview {
    id: number
    review: string
    rating: number
    createdOn: Date;
    updatedOn: Date;
    item: Item[]
}

@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    review: string

    @Column()
    rating: number

    @CreateDateColumn()
    createdOn: Date;

    @UpdateDateColumn()
    updatedOn: Date;

    @ManyToMany(type => Item, item => item.review)
    @JoinTable()
    item: Item[]


}