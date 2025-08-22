import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    topic:string 

    @IsString()
    @IsNotEmpty()
    message:string 

    @IsString()
    @IsNotEmpty()
    ticketType:string 

    @IsString()
    @IsOptional()
    priority:string 

    @IsOptional()
    tags:string[]

    @IsNumber()
    @IsOptional()
    from?:number

    @IsNumber()
    @IsOptional()
    department?:number

    @IsNumber()
    @IsOptional()
    assignee?:number
}

export class CreateTicketTypeDto {
    @IsString()
    @IsNotEmpty()
    name:string 
}
