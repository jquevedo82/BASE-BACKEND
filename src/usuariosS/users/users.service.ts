import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { Transaction } from 'mssql';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { RolNombre } from '../roles/entities/rol.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly sql: MsSqlConnectService,
  ) {}

  async create(dto: CreateUserDto): Promise<any> {
    const { username, email } = dto;

    const whereClause =
      username && email
        ? ` where username = '${username}' and email = '${email}'`
        : '';
    var query = `
        SELECT *
        FROM NeumenApi.dbo.usuarios ${whereClause}
    `;
    var result;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    const transaction = new Transaction(pool);
    try {
      await transaction.begin();
      // Ejecutar la consulta
      //const request = pool.request();
      const request = transaction.request();
      // Ejecutar la consulta
      result = await request.query(query);

      if (result.recordset.length == 1)
        throw new BadRequestException('El usuario que ingresaste ya existe');

      query = `
      SELECT *
      FROM NeumenApi.dbo.roles
      WHERE rolNombre = @rolNombre 
  `;
      // Ejecutar la consulta con un parámetro
      result = await request.input('rolNombre', RolNombre.USER).query(query);

      if (result.rowsAffected[0] == 0) {
        //await transaction.rollback();
        throw new BadRequestException('los roles no han sido creados');
      }

      const hashedPassword = await hashSync(dto.password, 10);
      const user = {
        // Asegúrate de asignar las propiedades correctas según tu modelo de usuario
        username: dto.username,

        email: dto.email,
        nombre: dto.nombre,
        password: hashedPassword,
        denominacion: dto.denominacion,
        isActivo: true,
        nivel: dto.nivel,

        // ... otras propiedades del usuario
      };

      const insertQuery = `
      INSERT INTO NeumenApi.dbo.usuarios (nombre,username,email,password,denominacion,nivel,isActivo)
      VALUES (@nombre,@username,@email,@password,@denominacion,@nivel,@isActivo)
  `;
      const nuevo = await request

        .input('nombre', user.nombre)
        .input('username', user.username)
        .input('email', user.email)
        .input('password', user.password)
        .input('denominacion', user.denominacion)
        .input('nivel', user.nivel)
        .input('isActivo', user.isActivo)
        .query(insertQuery);
      const resultx = await request.query(
        'SELECT MAX(id) AS id FROM NeumenApi.dbo.usuarios',
      );
      const ID_Usuario = resultx.recordset[0].id;

      for (const idRol of result.recordset) {
        const request = transaction.request();
        const insertQuery2 = `INSERT INTO NeumenApi.dbo.roles_usuarios (id_Rol, id_Usuario)
        VALUES (@id_Rol, @id_Usuario)  `;
        await request
          .input('id_Rol', idRol.id)
          .input('id_Usuario', ID_Usuario)
          .query(insertQuery2);
      }

      await transaction.commit();
      return nuevo;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async findAll(filterQuery): Promise<any> {//Promise<User[]> {
    const { limit } = filterQuery;

    const topClause = limit ? `TOP ${limit}` : '';
    const query = `
    SELECT ${topClause} *
    FROM NeumenApi.dbo.usuarios 
`;
const queryCount = `
SELECT count (*) as total
FROM NeumenApi.dbo.usuarios 
`;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      if (!result.recordset.length) return [];
      // Devolver el conjunto de registros
      //return result.recordset;
      const result2 = await pool.request().query(queryCount);
      return {
        total: result2.recordset[0].total,
        limit: result.rowsAffected[0],
        results: result.recordset,
      };
      
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
    /////////////////////////////
  }

  async findByName(filterQuery): Promise<User> {
    const { name, limit } = filterQuery;

    if (!name) throw new BadRequestException('Faltan datos para la consulta');
    ///////////////////////
    const topClause = limit ? ` TOP ${limit} ` : '';
    const whereClause = name ? ` WHERE username = '${name}' ` : '';
    const query = `
    SELECT ${topClause} *
    FROM NeumenApi.dbo.usuarios  ${whereClause}
`;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      if (!result.recordset.length) return null;
      // Devolver el conjunto de registros
      return result.recordset;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
    ///////////////////////
  }

  async findById(id: number): Promise<User> {
    ///////////////////////
    const whereClause = id ? ` WHERE id = '${id}' ` : '';
    const query = `
    SELECT *
    FROM NeumenApi.dbo.usuarios  ${whereClause}
`;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      if (!result.recordset.length) return null;
      // Devolver el conjunto de registros
      return result.recordset;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
    ///////////////////////
  }

  async update(
    codigoId: number,
    updateUsuarioDto: UpdateUserDto,
  ): Promise<any> {
    // puedo seleccionar de updateUsuarioDto los atributos q solo quiero actualizar
    // const newU: UpdateUserDto = { nivel: 2, denominacion: 'Prueba' };

    if (Object.keys(updateUsuarioDto).length === 0)
      throw new ConflictException('No actuliza ningun dato');

    const whereClause = codigoId ? ` WHERE id = '${codigoId}' ` : '';
    const query = `
      SELECT *
      FROM NeumenApi.dbo.usuarios  ${whereClause}
  `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      if (!result.recordset.length) return null;
      // Devolver el conjunto de registros
      const toUpdate = result.recordset;

      if (!toUpdate) throw new ConflictException('User no encontrado');

      const updated = Object.assign(toUpdate, updateUsuarioDto);

      let updateQuery = 'UPDATE NeumenApi.dbo.usuarios SET ';
      let isFirst = true;
      for (const key in updateUsuarioDto) {
        if (!isFirst) {
          updateQuery += ', ';
        }
        updateQuery += `${key} = @${key}`;
        isFirst = false;
      }
      updateQuery += ' WHERE id = @id';

      //console.log(updateQuery);
      const request2 = pool.request();
      for (const key in updateUsuarioDto) {
        request2.input(key, updateUsuarioDto[key]);
      }
      request2.input('id', codigoId);
      const result2 = await request2.query(updateQuery);

      return result2;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async remove(usuarioId: number): Promise<any> {
    /////////////////////////////

    const sqlQuery = `
DELETE FROM NeumenApi.dbo.usuarios
WHERE id = @usuarioId
`;

    const sqlQueryRol = `
DELETE FROM NeumenApi.dbo.roles_usuarios
WHERE id_Usuario = @usuarioId2
`;

    var result;
    var result2;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    const transaction = new Transaction(pool);
    try {
      await transaction.begin();
      // Ejecutar la consulta
      //const request = pool.request();
      const request = transaction.request();
      // Ejecutar la consulta
      result2 = await request.input('usuarioId2', usuarioId).query(sqlQueryRol);

      // Ejecutar la consulta con un parámetro
      result = await request.input('usuarioId', usuarioId).query(sqlQuery);

      if (result.rowsAffected[0] == 0) {
        //await transaction.rollback();
        throw new BadRequestException('No existe el Usuraio');
      }

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }

    ////////////////////////////////
  }

  async remove2(usuarioId: number): Promise<any> {
    const sqlQuery = `
    UPDATE NeumenApi.dbo.usuarios
    SET isActivo = 0
WHERE id = @usuarioId
`;

    //     const sqlQueryRol = `
    // DELETE FROM NeumenApi.dbo.roles_usuarios
    // WHERE id_Usuario = @usuarioId2
    // `;

    var result;
    var result2;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    const transaction = new Transaction(pool);
    try {
      await transaction.begin();
      // Ejecutar la consulta
      //const request = pool.request();
      const request = transaction.request();
      // eliminar roles del usuario a desactiva
      //result2 = await request.input('usuarioId2', usuarioId).query(sqlQueryRol);

      // Ejecutar la consulta con un parámetro
      result = await request.input('usuarioId', usuarioId).query(sqlQuery);

      if (result.rowsAffected[0] == 0) {
        //await transaction.rollback();
        throw new BadRequestException('No existe el Usuraio');
      }

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }
}
