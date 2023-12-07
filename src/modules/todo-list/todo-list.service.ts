import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TodoListService {
  queryRunner = this.dataSource.createQueryRunner();
  constructor(private dataSource: DataSource) {}

  async getTodoById(id: number) {
    const row = await this.queryRunner.manager.query(
      `select * from todos where id = ? `,
      [id],
    );
    return row[0];
  }

  async shareTodo2(user_id, shared_with_id) {
    // const queryRunner = this.dataSource.createQueryRunner();

    const [result] = await this.queryRunner.manager.query(
      `insert into share_todos (user_id,shared_with_id) values (?,?) `,
      [user_id, shared_with_id],
    );
    console.log(result);
    return result;
  }
  async shareTodo(todo_id, user_id, shared_with_id) {
    console.log(todo_id, user_id, shared_with_id);
    const result = await this.queryRunner.manager.query(
      `
      INSERT INTO shared_todos (todo_id, user_id, shared_with_id) 
      VALUES (?, ?, ?);
      `,
      [todo_id, user_id, shared_with_id],
    );
    return result.insertId;
  }

  async getTodosByID(id) {
    const rows = await this.queryRunner.manager.query(
      `
      SELECT todos.*, shared_todos.shared_with_id
      FROM todos
      LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
      WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
    `,
      [id, id],
    );
    console.log(rows);
    return rows;
  }

  async getTodo(id) {
    const rows = await this.queryRunner.manager.query(
      `SELECT * FROM todos WHERE id = ?`,
      [id],
    );
    console.log(rows);
    
    return rows;
  }

  async getSharedTodoByID(id) {
    const [rows] = await this.queryRunner.manager.query(
      `SELECT * FROM shared_todos WHERE todo_id = ?`,
      [id],
    );
    return rows;
  }

  async getUserByID(id) {
    const rows = await this.queryRunner.manager.query(
      `SELECT * FROM users WHERE id = ?`,
      [id],
    );
    return rows;
  }

  async getUserByEmail(email) {
    const rows = await this.queryRunner.manager.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
    );
    // console.log(rows[0]);
    return rows[0];
  }

  async createTodo(user_id, title) {
    const result = await this.queryRunner.manager.query(
      `
      INSERT INTO todos (user_id, title)
      VALUES (?, ?)
    `,
      [user_id, title],
    );
    const todoID = result.insertId;
    return this.getTodo(todoID);
  }

  async deleteTodo(id) {
    const result = await this.queryRunner.manager.query(
      `
      DELETE FROM todos WHERE id = ?;
      `,
      [id],
    );
    return result;
  }

  async toggleCompleted(id, value) {
    //console.log(value.value);
    const newValue = value.value === true ? 'TRUE' : 'FALSE';
    //console.log(newValue);
    const result = await this.queryRunner.manager.query(
      `
      UPDATE todos
      SET completed = ${newValue} 
      WHERE id = ?;
      `,
      [id],
    );
   //console.log(result);
    return result['changedRows'];
  }
}
