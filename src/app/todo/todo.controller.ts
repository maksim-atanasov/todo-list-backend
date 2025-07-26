import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TokenAuthGuard } from 'src/guards/token-auth.guard';
import { UserProvider } from 'src/decorators/userProvider.decorator';
import { User } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Response } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  // @Get('all')
  // async getTodos() {
  //   return await this.todoService.getTodos();
  // }

  @UseGuards(TokenAuthGuard)
  @Get('my-todos')
  async getUserTodos(@UserProvider() user: User) {
    return await this.todoService.getUserTodos(user.id);
  }

  @UseGuards(TokenAuthGuard)
  @Post('create')
  async createTodo(@Body() data: CreateTodoDto, @UserProvider() user: User) {
    return await this.todoService.createTodo({
      ...data,
      userId: user.id,
      completed: false,
    });
  }

  @UseGuards(TokenAuthGuard)
  @Post('update')
  async updateTodo(@Body() data: UpdateTodoDto, @UserProvider() user: User) {
    const getUserTodos = await this.todoService.getUserTodos(user.id);

    if (!getUserTodos.find((todo) => todo.id === data.id)) {
      return new NotFoundException('Todo not found');
    }

    return await this.todoService.updateTodo(data.id, data);
  }

  @UseGuards(TokenAuthGuard)
  @Delete('delete/:id')
  async deleteTodo(
    @Param() params: { id: string },
    @UserProvider() user: User,
    @Res() res: Response,
  ) {
    const getUserTodos = await this.todoService.getUserTodos(user.id);

    const id = +params.id;

    if (!getUserTodos.find((todo) => todo.id === +params.id)) {
      return new NotFoundException('Todo not found');
    }

    await this.todoService.deleteTodo(id);

    res.status(204).send();
  }
}
