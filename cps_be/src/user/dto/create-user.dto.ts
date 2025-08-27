import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "../entities/user.entity"
// import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    // @ApiProperty({
    //     description: "name",
    //     example: "John Doe",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

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
    password?:string

    // @ApiProperty({
    //     description: "Role",
    //     example: "USER",
    //     required: false
    // })
    @IsEnum(Role)
    @IsOptional()
    role?:Role
}

export class FindUsersDto {
    // @ApiProperty({
    //     description: "name",
    //     example: "John Doe",
    //     required: false
    // })
    @IsString()
    @IsOptional()
    name?:string 

    // @ApiProperty({
    //     description: "email",
    //     example: "test@example.com",
    //     required: false
    // })
    @IsEmail()
    @IsOptional()
    email?:string
}

export class AddressDto {
    // @ApiProperty({
    //     description: "Country name",
    //     example: "Ghana",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    country:string 

    // @ApiProperty({
    //     description: "State or region name",
    //     example: "Greater Accra",
    //     required: false
    // })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    state:string 

    // @ApiProperty({
    //     description: "City name",
    //     example: "Greater Accra",
    //     required: false
    // })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city:string 

    // @ApiProperty({
    //     description: "Street Address",
    //     example: "12 Oakland Street",
    //     required: true
    // })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    addressLineOne:string 

    // @ApiProperty({
    //     description: "Street Address",
    //     example: "12 Oakland Street",
    //     required: true
    // })
    // @IsDefined()
    @IsString()
    @IsOptional()
    addressLineTwo:string 

    // @ApiProperty({
    //     description: "Zip code",
    //     example: '0000',
    //     required: true
    // })
    // @IsString()
    // zip:string

    // @ApiProperty({
    //     description: "Nearest Landmark",
    //     example: "TDC Towers",
    //     required: false
    // })
    @IsOptional()
    @IsString()
    landmark:string 
}
