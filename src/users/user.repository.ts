import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { AbstractRepository } from "../shared/repository.abstract";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
    constructor(
        @InjectRepository(User)
        repository: Repository<User>
    ) {
        super(repository);
    }
}