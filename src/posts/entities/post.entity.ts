import { Category } from "../../categories/entities/category.entity";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, Entity, ManyToOne } from "typeorm";

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
