import {HttpException, Injectable} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {PostsRepository} from "./posts.repostory";

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostsRepository) {}
  async create(dto: CreatePostDto) {
    const post = this.postRepository.create(dto);
    if (!post) {
      throw new Error('Failed to create post');
    }
    const saved = await this.postRepository.save(post);
    if (!saved) {
      throw new HttpException('Failed to create post' ,400);
    }

    return {
        success: true,
        message: 'Post created successfully',
        data: saved,
    }
  }

  async findAll() {
    const posts= await this.postRepository.find();
    if(!posts){
        throw new HttpException('Failed to find posts' ,400);
    }

    return{
        success: true,
        message: 'Posts retrieved successfully',
        data: posts,
    }
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({where: {id}});

    if(!post) {
        throw new HttpException('Failed to find post' ,400);
    }
    return {
        success: true,
        message: 'Post retrieved successfully',
        data: post,
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({where: {id}});
    if(!post) {
        throw new HttpException('Post not found' ,404);
    }

    const updated = Object.assign(post, updatePostDto);
    const saved = await this.postRepository.save(updated);
    if(!saved) {
        throw new HttpException('Failed to update post' ,400);
    }

    return {
        success: true,
        message: 'Post updated successfully',
        data: saved,
    }
  }

  async remove(id: string) {
    const post = await this.postRepository.findOne({where: {id}});
    if(!post) {
        throw new HttpException('Post not found' ,404);
    }

    const deleted = await this.postRepository.remove(post);
    if(!deleted) {
        throw new HttpException('Failed to delete post' ,400);
    }

    return {
        success: true,
        message: 'Post deleted successfully',
        data: deleted,
    }
  }
}
