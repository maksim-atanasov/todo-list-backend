import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/utils/helpers/brcypter';
import { Public } from 'src/Decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/registration')
  @HttpCode(201)
  async registration(@Body() body: CreateUserDto) {
    const user = await this.userService.getUserByEmail(body.email);

    if (user !== null) {
      return new BadRequestException('Email already exists');
    }

    const hashedPassword = await hashPassword(body.password);

    return this.userService.createUser({
      email: body.email,
      password: hashedPassword,
    });
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: CreateUserDto) {
    const user = await this.userService.getUserByEmail(body.email);

    if (user === null) {
      return new NotFoundException('User not found');
    }

    const isPasswordValid = await comparePassword(body.password, user.password);

    if (!isPasswordValid) {
      return new BadRequestException('Invalid password');
    }

    const token = await this.userService.createToken(user.id);

    return { token };
  }

  @Get('/profile')
  @HttpCode(200)
  async profile(@Headers('Authorization') token: string) {
    const user = await this.userService.getUserByToken(token.split(' ')[1]);

    if (user === null) {
      return new NotFoundException('User not found');
    }

    return {
      email: user.email,
    };
  }
}
