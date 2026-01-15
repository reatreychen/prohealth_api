import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pricing_plans')
export class PricingPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  subtitle: string;

  @Column('decimal')
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: 0 })
  duration: number;

  @Column('text', { array: true, default: [] })
  features: string[];

  @CreateDateColumn()
  createdAt: Date;
}

