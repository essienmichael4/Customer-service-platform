import { Injectable } from '@nestjs/common';
import { AddressDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRequest } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import { v4 } from 'uuid';
import { hash } from 'bcryptjs';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Address) private readonly addressRepo:Repository<Address>,
  ){}

  async addAddress(id:number, addressDto:AddressDto){
    try{
      const user = await this.userRepo.findOne({
        where: {
         id
        }
      })
      const addressEntity = this.addressRepo.create()

      const saveEntity = {
        ...addressEntity,
        addressId: v4(),
        country: addressDto.country,
        state: addressDto.state,
        city: addressDto.city,
        addressLineOne: addressDto.addressLineOne,
        addressLineTwo: addressDto.addressLineTwo,
        landmark: addressDto.landmark,
        user
      }

      const address = await this.addressRepo.save(saveEntity) 

      return address
    }catch(err){
      throw err
    }
  }

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
        email: createUserDto.email.toLowerCase(),
        ...(createUserDto.role && {role: createUserDto.role as Role})
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

  async findAll(pageOptionsDto:PageOptionsDto) {
    const clients = await this.userRepo.findAndCount({
      order:{
        id: "DESC"
      },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip
    })

    // const ticketsResponse = clients[0].map(ticket=> new TicketResponseDto(ticket))
    
      const pageMetaDto = new PageMetaDto({itemCount: clients[1], pageOptionsDto})
      return new PageDto(clients[0], pageMetaDto)
  }

  async findAllClients() {
    return await this.userRepo.find({
      where: {
        role: Role.USER
      }
    })
  }

  async findAllAdmins() {
    return await this.userRepo.find({
      where: {
        role: Role.ADMIN
      }
    })
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({
      where: {
        id
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateUser(id: number, fields:UpdateUserRequest) {
    const {phone, name, email, role} = fields
    await this.userRepo.update(id, {
      ...(name && { name: name }),
      ...(name && { searchName: name.toLowerCase() }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(role && { role }),
    })
  
    return await this.userRepo.findOneBy({id});
  }

  async updateAddress(addressId:number, addressDto:AddressDto){
    try{
      const address = await this.addressRepo.findOne({
        where: {
          id: addressId
        }
      })

      address.country = addressDto.country
      address.state = addressDto.state
      address.city = addressDto.city
      address.addressLineOne = addressDto.addressLineOne
      address.landmark = addressDto.landmark
      if(addressDto.addressLineTwo){
        address.addressLineTwo = addressDto.addressLineTwo
      }

      await this.addressRepo.update(address.id, address)

      return address
    }catch(err){
      throw err
    }
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
