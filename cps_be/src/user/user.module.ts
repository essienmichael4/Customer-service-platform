import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Branch } from './entities/branch.entity';
import { Department } from './entities/Department.entity';
import { Address } from './entities/address.entity';
import { Message } from 'src/ticket/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Branch, Department, Address, Message])],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports:[UserService]
})
export class UserModule {}
