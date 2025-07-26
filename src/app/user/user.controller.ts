import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/utils/helpers/brcypter';
import { TokenAuthGuard } from 'src/guards/token-auth.guard';
import { UserProvider } from 'src/decorators/userProvider.decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @UseGuards(TokenAuthGuard)
  @Get('/profile')
  @HttpCode(200)
  profile(@UserProvider() user: User) {
    return {
      email: user.email,
      created_at: user.created_at,
    };
  }
}
