import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  products: OrderItem[];

  @Column({ nullable: true })
  paymentId: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
  })
  paymentStatus: string;

  @Column({ type: 'decimal', default: 0 })
  subTotalAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}
