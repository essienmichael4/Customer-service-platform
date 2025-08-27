import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { AddressDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRequest } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("clients/all")
  findAllClientsForAdmin(@Query() pageOptionsDto:PageOptionsDto,) {
    return this.userService.findAll(pageOptionsDto);
  }

  @Get("clients")
  findAllClients() {
    return this.userService.findAllClients();
  }

  @Get("admins")
  findAllAdmins() {
    return this.userService.findAllAdmins();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequest) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post(":id/address")
  addAddress(@Body() addressDto: AddressDto, @User() user:UserInfo) {
    return this.userService.addAddress(user.sub.id, addressDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/address/:addressId')
  updateAddress(@Param('id', ParseIntPipe) id: number, @Param('addressId', ParseIntPipe) addressId: number, @Body() addressDto: AddressDto, @User() user:UserInfo) {
    try{
      if(id !== user.sub.id) throw new UnauthorizedException()
      return this.userService.updateAddress(addressId, addressDto)
    }catch(err){
      throw err
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
