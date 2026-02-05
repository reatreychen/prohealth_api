import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserRepository } from "../users/user.repository";
import { OrderRepository } from "./order.repository";
import { ProductRepository } from "../product/product.repository";
import { OrderItem } from "./entities/orderItem.entity";
import { Order } from "./entities/order.entity";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
    // inject repositories for User, Product, and Order here
    constructor(private readonly orderRepository: OrderRepository,
        private readonly userRepository: UserRepository,
        private readonly productRepository: ProductRepository,) {
    }

    async create(createOrderDto: CreateOrderDto) {
        // verify user exists
        const user = await this.userRepository.findOne({ where: { id: createOrderDto.userId } })

        if (!user) {
            throw new HttpException("User not found", 404);
        }

        // validate product and calculate total price
        let subTotal = 0;
        const orderItems: OrderItem[] = [];
        for (const item of createOrderDto.items) {
            const product = await this.productRepository.findOne(
                { where: { id: item.productId } }
            )
            if (!product) {
                throw new HttpException(`Product with id ${item.productId} not found`, 404);
            }

            const orderItem = new OrderItem();
            orderItem.product = product;
            orderItem.quantity = item.quantity;
            orderItem.price = product.price;
            orderItems.push(orderItem);

            subTotal += Number(product.price) * item.quantity;
        }

        // create order
        const order = new Order();
        order.orderId = `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`;
        order.user = user;
        order.products = orderItems;
        order.subTotalAmount = subTotal;
        order.paymentStatus = "PENDING";
        const saveOrder = await this.orderRepository.save(order);
        return {
            message: "Order created successfully",
            data: saveOrder,
            success: true,
            error: false

        }

    }

    async findAll() {
        const orders = await this.orderRepository.find({
            relations: ['user', 'products', 'products.product'],
            order: { createdAt: 'DESC' },
        });
        return {
            success: true,
            data: orders
        };
    }

    async findOne(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'products', 'products.product'],
        });

        if (!order) {
            throw new HttpException("Order not found", 404);
        }

        return {
            success: true,
            data: order
        };
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['products', 'products.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async update(id: string, updateOrderDto: UpdateOrderDto) {

    }

    async remove(id: string) {
        const order = await this.findOne(id);
        await this.orderRepository.delete(id);
        return {
            message: "Order deleted successfully",
            data: order,
            success: true,
            error: false
        }
    }
}
