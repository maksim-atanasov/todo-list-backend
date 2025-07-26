import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, UserService],
})
export class TodoModule {}
