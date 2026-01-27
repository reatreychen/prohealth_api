import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '../shared/repository.abstract';
import {Product} from "./entities/product.entity";

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
    constructor(
        @InjectRepository(Product)
        repository: Repository<Product>,
    ) {
        super(repository);
    }
}
