import { Category } from '../../categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: '' })
  content: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category)
  category: Category;

  @CreateDateColumn()
  createdAt: Date;
}
