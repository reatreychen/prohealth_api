import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ type: 'bigint', nullable: true })
  mobile: number;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
  })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address_detail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shopping_cart: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role: string;
}
