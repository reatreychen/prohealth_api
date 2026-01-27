import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { array: true, default: [] })
  image: string[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @Column({ default: '' })
  unit: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ type: 'decimal', nullable: true })
  discount: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: true })
  public: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
