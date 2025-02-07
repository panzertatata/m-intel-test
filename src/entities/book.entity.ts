import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  author: string;

  @Column()
  publicationYear: string;

  @Column()
  price: number;

  @Column()
  remaining: number;
}
