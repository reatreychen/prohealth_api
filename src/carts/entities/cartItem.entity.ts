import { Product } from "../../product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, cart => cart.products)
  cart: Cart;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ default: 1 })
  quantity: number;
}
