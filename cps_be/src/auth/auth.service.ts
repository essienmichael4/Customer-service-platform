import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { UserSignUpDto, ForgottenPasswordDto, ResetPasswordDto } from './dto/register.dto';
import { UserAuthReponse, LoginReponse } from './dto/response.dto';
import { UserSignInDto } from './dto/signin.dto';

interface PayloadParams{
  username: string,
  sub: {
      id: number,
      name: string,
      role: string
  }
}

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) 
    private readonly userRepo:Repository<User>, 
    private userService: UserService,
    private jwtService:JwtService,
  ){}

async findUser(email:string){
    return await this.userService.findUserByEmail(email)
  }

  async register(userSignUpDto:UserSignUpDto){
    try{
      const userExists = await this.findUser(userSignUpDto.email)
      if(userExists) throw new ConflictException("Email already exists")

      const newUser = await this.userService.create(userSignUpDto)
      const user = new UserAuthReponse(newUser)

      const payload = {
        username: user.email,
        sub: {
            id: user.id,
            name: user.name,
            role: user.role
        }
      }

      return new LoginReponse({
        ...user, 
        backendTokens: {
          accessToken: await this.signAuthPayload(payload), 
          refreshToken: await this.signRefreshPayload(payload)
        }
      })
    }catch(err){
      throw err
    }
  }

  async login(userSignInDto:UserSignInDto){
    try{
      const userExists = await this.findUser(userSignInDto.email)
      if(!userExists) throw new HttpException("Invalid credentials", 401)

      const isValidPassword = await compare(userSignInDto.password, userExists.password)
      if(!isValidPassword) throw new HttpException("Invalid credentials", 401)
      const user = new UserAuthReponse(userExists)

      const payload = {
        username: user.email,
        sub: {
            id: user.id,
            name: user.name,
            role: user.role
        }
      }

      return new LoginReponse({
        ...user, 
        backendTokens: {
          accessToken: await this.signAuthPayload(payload), 
          refreshToken: await this.signRefreshPayload(payload)
        }
      })
    }catch(err){
      throw err
    }
  }

  async forgotPassword(forgottenPasswordDto:ForgottenPasswordDto){
    try{
      const userExists = await this.findUser(forgottenPasswordDto.email)
      if(!userExists) throw new HttpException("The account does not exist on this platform", 401)

      const user = new UserAuthReponse(userExists)

      const payload = {
        username: user.email,
        sub: {
            id: user.id,
            name: user.name,
            role: user.role
        }
      }

      const signedId = await this.signResetPasswordPayload(payload, '30m')

      const link = `https://clixmartonline.com/reset-password?id=${signedId}&email=${user.email}`
      
      // this.eventEmitter.emit("reset.password", {email: user.email, name: user.name, link})

      return ({message: "Password reset request has been submitted successfully. A link has been sent to the email account provided to reset your password."})
      
    }catch(err){
      throw err
    }
  }

  async resetPassword(resetPasswordDto:ResetPasswordDto){
    try{
      const payload = this.jwtService.verify(resetPasswordDto.id, {
        secret: process.env.JWT_SECRET_KEY
      })

      if(resetPasswordDto.email !== payload.user.username) throw new UnauthorizedException("")
      const userExists = await this.findUser(resetPasswordDto.email)
      if(userExists) throw new HttpException("The account does not exist on this platform", 401)

      if(resetPasswordDto.password !== resetPasswordDto.confirmPassword) throw new HttpException("Passwords do not match", 401)

      const reset = await this.userService.resetPassword(userExists.id, resetPasswordDto.password)
      return {message: "Password reset successful. Please login."}
    }catch(err){
      throw err
    }
  }

  async signAuthPayload(payload:PayloadParams){
    return this.jwtService.sign(payload, {
        expiresIn: "1h",
        secret: process.env.JWT_SECRET_KEY
    })
  }

  async resignAuthPayload(payload:PayloadParams){
      return this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET_KEY
      })
  }

  async signRefreshPayload(payload:PayloadParams){
      return this.jwtService.sign(payload, {
          expiresIn: "7d",
          secret: process.env.JWT_REFRESH_KEY
      })
  }

  async signResetPasswordPayload(payload:PayloadParams, time: string){
      return await this.jwtService.sign(payload, {
          expiresIn: time,
          secret: process.env.JWT_SECRET_KEY
      })
  }
}
