// import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "src/user/entities/user.entity"

export class UserSignUpDto{
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsDefined()
    @IsString()
    @MinLength(8)
    password?:string

    @IsDefined()
    @IsString()
    @MinLength(8)
    confirmPassword?:string

    @IsEnum(Role)
    @IsOptional()
    role?:Role
}

export class AdminSignUpDto{
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @IsEnum(Role)
    @IsOptional()
    role?:Role
}

export class ForgottenPasswordDto {
    // @ApiProperty({
    //     description: "email",
    //     example: "test@example.com",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string
}

export class ResetPasswordDto {
    // @ApiProperty({
    //     description: "token",
    //     example: "xxxxxxxxxxx",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    id:string

    // @ApiProperty({
    //     description: "email",
    //     example: "test@example.com",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    // @ApiProperty({
    //     description: "Password",
    //     example: "xxxxxxxxxxx",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @MinLength(8)
    password:string

    // @ApiProperty({
    //     description: "Password",
    //     example: "xxxxxxxxxxx",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @MinLength(8)
    confirmPassword?:string
}
