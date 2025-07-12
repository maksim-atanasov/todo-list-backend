import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TokenAuthGuard } from './guards/token-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TodoModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
