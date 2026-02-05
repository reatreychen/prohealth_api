import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }

  async create(createUserDto: CreateUserDto) {
    try {
      // create user entity
      const userEntity = this.userRepository.create(createUserDto);

      //hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      if (!hashedPassword) {
        throw new BadRequestException('Password hashing failed');
      }

      userEntity.password = hashedPassword;
      // save user
      const user = await this.userRepository.save({
        ...userEntity,
        password: hashedPassword,
      });

      //validation
      if (!user) {
        throw new BadRequestException('user not created');
      }
      return {
        success: true,
        message: 'User created successfully',
        data: user
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return {
      success: true,
      data: users
    };
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return {
      success: true,
      data: user
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new BadRequestException(`User with id ${id} not found`);
      }

      const updatedUser = await this.userRepository.save({
        ...user,
        ...updateUserDto
      });
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      };
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
      return {
        success: true,
        message: `User with id ${id} has been deleted`
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // compare hashed password
  async compareHash(text: string, hash: string) {
    try {
      return await bcrypt.compare(text, hash);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.userRepository.update(userId, {
      refreshToken,
    });
  }
}
