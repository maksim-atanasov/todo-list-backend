import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserByToken(token: string) {
    const { sub: id } = await this.jwtService.verifyAsync(token);
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    await this.prisma.user.create({
      data,
    });

    return {
      message: 'User created successfully',
    };
  }

  async createToken(id: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const newToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '14d' },
    );

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        token: newToken,
      },
    });

    return newToken;
  }
}
