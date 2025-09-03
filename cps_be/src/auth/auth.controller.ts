import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AdminSignUpDto, ForgottenPasswordDto, ResetPasswordDto, UserSignUpDto } from './dto/register.dto';
import { LoginReponse } from './dto/response.dto';
import { UserSignInDto } from './dto/signin.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { RefreshJwtGuard } from 'src/guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  async signup(@Body() body:UserSignUpDto){
    try{
      return this.authService.register(body);
    }catch(err){
      throw err
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("signup/admin")
  async signupAdmin(@Body() body:AdminSignUpDto){
    try{
      return this.authService.registerAdmin(body);
    }catch(err){
      throw err
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signin(@Body() body:UserSignInDto){
    return await this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  @Get("refresh")
  async refreshToken(@User() req:UserInfo){
    const accessToken =  {accessToken: await this.authService.resignAuthPayload(req)}
    
    return accessToken
  }

  @HttpCode(HttpStatus.OK)
  @Get("forgot-password")
  async forgottenPassword(@Body() body:ForgottenPasswordDto){
    try{
      return this.authService.forgotPassword(body)
    }catch(err){
      throw err
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  async resetPassword(@Body() body:ResetPasswordDto){
    try{
      return this.authService.resetPassword(body)
    }catch(err){
      throw err
    }
  }
}
