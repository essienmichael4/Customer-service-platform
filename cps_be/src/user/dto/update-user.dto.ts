import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEnum, IsDefined, IsEmail } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    name:string 

    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsString()
    @IsOptional()
    phone?:string

    @IsOptional()
    @IsEnum(Role)
    role?:Role 
}

export class UpdateUserRoleRequest {
    @IsEnum(Role)
    role?:Role 
}
