import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    try{
      const userEntity = this.userRepo.create()
      const saveEntity = {
        ...userEntity,
        ...createUserDto,
        userId: v4(),
        password: await this.hashPassword(createUserDto.password),
        name: createUserDto.name,
        searchName: createUserDto.name.toLowerCase(),
        email: createUserDto.email.toLowerCase()  
      }

      const user = await this.userRepo.save(saveEntity)
      return user
    }catch(err){
      throw err
    }
  }

  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async resetPassword(id: number, password:string) {
    try{
      return await this.userRepo.update(id, {
        password: await this.hashPassword(password)
      })
    }catch(err){
      throw err
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }
}
