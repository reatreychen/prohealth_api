import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "./entities/post.entity";
import {PostsRepository} from "./posts.repostory";
import {UploadModule} from "../upload/upload.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Post]),
      UploadModule
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
