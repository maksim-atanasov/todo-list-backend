import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getTodos() {
    return await this.prisma.todo.findMany();
  }

  async getUserTodos(userId: number) {
    return await this.prisma.todo.findMany({ where: { userId } });
  }

  async createTodo(
    data: CreateTodoDto & { userId: number; completed: boolean },
  ) {
    return await this.prisma.todo.create({ data });
  }

  async updateTodo(id: number, data: UpdateTodoDto) {
    return await this.prisma.todo.update({ where: { id }, data });
  }

  async deleteTodo(id: number) {
    return await this.prisma.todo.delete({ where: { id } });
  }
}
