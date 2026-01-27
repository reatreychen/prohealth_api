import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '../shared/repository.abstract';
import {Order} from "./entities/order.entity";

@Injectable()
export class OrderRepository extends AbstractRepository<Order> {
    constructor(
        @InjectRepository(Order)
        repository: Repository<Order>,
    ) {
        super(repository);
    }
}
