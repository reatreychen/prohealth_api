import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {

  constructor(private readonly userRepository: UserRepository){}

  async create(createUserDto: CreateUserDto) {
    try {
      const userEntity = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(userEntity);
      //validation
      if(!user) {
        throw new BadRequestException('user not created');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new BadRequestException(`User with id ${id} not found`);
      }

      // Update user properties
      if (updateUserDto.firstName !== undefined) {
        user.firstName = updateUserDto.firstName;
      }
      if (updateUserDto.lastName !== undefined) {
        user.lastName = updateUserDto.lastName;
      }

      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new BadRequestException(`User with id ${id} not found`);
      }

      await this.userRepository.remove(user);
      return { message: `User with id ${id} has been deleted` };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
