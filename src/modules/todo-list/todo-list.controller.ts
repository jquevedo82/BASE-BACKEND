import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoListService } from './todo-list.service';

@Controller('todo-list')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  @Get('todos/:id')
  async getTodoList(@Param('id') id: number) {
    return await this.todoListService.getTodosByID(id);
  }

  @Get('todos/shared_todos/:id')
  async getTodosList(@Param('id') id: number) {
    const todo = await this.todoListService.getSharedTodoByID(id);
    const author = await this.todoListService.getUserByID(todo.user_id);
    const shared_with = await this.todoListService.getUserByID(
      todo.shared_with_id,
    );
    console.log(todo);
    return { author, shared_with };
  }

  @Put('todos/:id')
  async updateTodo(@Param('id') id: number, @Body() value) {
    return await this.todoListService.toggleCompleted(id, value);
  }

  @Delete('todos/:id')
  async deleteTodo(@Param('id') id: number) {
    await this.todoListService.deleteTodo(id);
    return { message: 'Todo deleted successfully' };
  }
  @Post('todos/shared_todos')
  async updateSharedTodo(@Body() value: any) {
    const { todo_id, user_id, email } = value;
    const userToShare = await this.todoListService.getUserByEmail(email);
    const sharedTodo = await this.todoListService.shareTodo(
      todo_id,
      user_id,
      userToShare.id,
    );
    return sharedTodo;
  }

  @Post('todos')
  async createTodo(@Body() value: any) {
    const { user_id, title } = value;
    const todo = await this.todoListService.createTodo(user_id, title);

    return { todo };
  }
}
