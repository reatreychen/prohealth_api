import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '../shared/repository.abstract';
import {Post} from "./entities/post.entity";

@Injectable()
export class PostsRepository extends AbstractRepository<Post> {
    constructor(
        @InjectRepository(Post)
        repository: Repository<Post>,
    ) {
        super(repository);
    }
}
