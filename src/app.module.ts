import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './app/todo/todo.module';
import { PrismaModule } from './app/prisma/prisma.module';
import { UserModule } from './app/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants/jwtConstants';

@Module({
  imports: [
    TodoModule,
    PrismaModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
