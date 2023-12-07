import { Module } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { TodoListController } from './todo-list.controller';
import { WriteLogService } from 'src/config/writelog.service';

@Module({
  controllers: [TodoListController],
  providers: [TodoListService, WriteLogService]
})
export class TodoListModule {}
