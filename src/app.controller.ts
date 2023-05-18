import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('api')
export class AppController {
  constructor(private appService: AppService, private jwtService: JwtService) {}

  @Post('/registor')
  async registor(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.appService.registor({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    });
  }

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.login(email);
    if (!user) {
      throw new NotFoundException('email not found ');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException('Incorrect passowrd ');
    }

    const payload = { userName: user.name,email: user.email, sub: user.id };
    const jwt = await this.jwtService.signAsync(payload);
    response.cookie('jwt', jwt, { httpOnly: true });
    console.log(jwt);
    return { message: 'success' };
  }
  @Get('user')
  async fooditems(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      if (!cookie) {
        throw new UnauthorizedException()
      }
      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      } else {
      const user = await this.appService.findOne(data['email'])
      // const user1 = await this.jwtService.verify(data['email'])
      return user;
      }
    } catch (e) {
      console.log(e.message);
      throw new UnauthorizedException();
    }
  }
}
