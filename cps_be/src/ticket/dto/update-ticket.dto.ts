import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class UpdateTicketStatusDto {
    @IsString()
    @IsNotEmpty()
    status:string 
}

export class UpdateTicketTypeDto {
    @IsNumber()
    @IsNotEmpty()
    typeId:number 
}

export class UpdateTicketPrioirityDto {
    @IsString()
    @IsNotEmpty()
    priority:string 
}
