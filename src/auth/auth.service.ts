import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Transaction } from 'mssql';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { RolNombre } from 'src/usuariosS/roles/entities/rol.enum';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { TokenDto } from './dto/token.dto';
import { PayLoadInterface } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sql: MsSqlConnectService,
  ) {}

  async findAll(filterQuery): Promise<User[]> {
    const { limit } = filterQuery;
    const topClause = limit ? `TOP ${limit}` : '';
    const query = `
        SELECT ${topClause} *
        FROM NeumenApi.dbo.lvw_Usuarios
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);

      // Devolver el conjunto de registros
      return result.recordset;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
    //return usuarios;
  }

  async createDev(dto: NuevoUsuarioDto): Promise<any> {
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
      WHERE rolNombre = @rolNombre or rolNombre = @rolNombre2 or rolNombre = @rolNombre3 or rolNombre = @rolNombre4
  `;
      // Ejecutar la consulta con un parámetro
      result = await request
        .input('rolNombre', RolNombre.USER)
        .input('rolNombre2', RolNombre.ADMIN)
        .input('rolNombre3', RolNombre.SUPER)
        .input('rolNombre4', RolNombre.DEV)
        .query(query);
      console.log(result);
      if (result.rowsAffected[0] != 4) {
        throw new BadRequestException('los roles no han sido creados');
      }

      const hashedPassword = await hash(dto.password, 10);
      const user = {
        // Asegúrate de asignar las propiedades correctas según tu modelo de usuario
        username: dto.username,

        email: dto.email,
        password: hashedPassword,
        denominacion: dto.Descri,
        isActivo: true,
        nivel: dto.nivel,

        // ... otras propiedades del usuario
      };

      const insertQuery = `
      INSERT INTO NeumenApi.dbo.usuarios (username,email,password,denominacion,nivel,isActivo)
      VALUES (@username,@email,@password,@denominacion,@nivel,@isActivo)
  `;
      const nuevo = await request

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
      console.log(nuevo);
      return nuevo;
    } catch (error) {
      console.log('object');
      //console.error('Error al crear usuario:', error);
      await transaction.rollback();
      throw error;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async createSuper(dto: NuevoUsuarioDto): Promise<any> {
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
      WHERE rolNombre = @rolNombre or rolNombre = @rolNombre2 or rolNombre = @rolNombre3
  `;
      // Ejecutar la consulta con un parámetro
      result = await request
        .input('rolNombre', RolNombre.USER)
        .input('rolNombre2', RolNombre.ADMIN)
        .input('rolNombre3', RolNombre.SUPER)
        .query(query);

      if (result.rowsAffected[0] != 3) {
        throw new BadRequestException('los roles no han sido creados');
      }

      const hashedPassword = await hash(dto.password, 10);
      const user = {
        // Asegúrate de asignar las propiedades correctas según tu modelo de usuario
        username: dto.username,

        email: dto.email,
        nombre: dto.nombre,
        password: hashedPassword,
        denominacion: dto.Descri,
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
      console.log('object');
      //console.error('Error al crear usuario:', error);
      await transaction.rollback();
      throw error;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async createAdmin(dto: NuevoUsuarioDto): Promise<any> {
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
      WHERE rolNombre = @rolNombre or rolNombre = @rolNombre2
  `;
      // Ejecutar la consulta con un parámetro
      result = await request
        .input('rolNombre', RolNombre.USER)
        .input('rolNombre2', RolNombre.ADMIN)
        .query(query);

      if (result.rowsAffected[0] != 2) {
        throw new BadRequestException('los roles no han sido creados');
      }
      const hashedPassword = await hash(dto.password, 10);
      const user = {
        // Asegúrate de asignar las propiedades correctas según tu modelo de usuario
        username: dto.username,

        email: dto.email,
        nombre: dto.nombre,
        password: hashedPassword,
        denominacion: dto.Descri,
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
      console.log('object');
      //console.error('Error al crear usuario:', error);
      await transaction.rollback();
      throw error;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }
  async createUser(dto: NuevoUsuarioDto): Promise<any> {
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

      const hashedPassword = await hash(dto.password, 10);
      const user = {
        // Asegúrate de asignar las propiedades correctas según tu modelo de usuario
        username: dto.username,

        email: dto.email,
        nombre: dto.nombre,
        password: hashedPassword,
        Descri: dto.Descri,
        isActivo: true,
        nivel: dto.nivel,

        // ... otras propiedades del usuario
      };

      const insertQuery = `
      INSERT INTO NeumenApi.dbo.usuarios (nombre,username,email,password,Descri,nivel,isActivo)
      VALUES (@nombre,@username,@email,@password,@denominacion,@nivel,@isActivo)
  `;
      const nuevo = await request

        .input('nombre', user.nombre)
        .input('username', user.username)
        .input('email', user.email)
        .input('password', user.password)
        .input('Descri', user.Descri)
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

  //   async login2(dto: LoginUsuarioDto): Promise<any> {
  //     const { username, password } = dto;

  //     /*
  //     const usuario = await this.authRepository.findOne({
  //       where: [{ username: username }, { email: username }],
  //     });
  //     console.log("usuario: ", usuario);
  // */
  //     //console.log('usuario2: ', username);

  //     const whereClause = username ? ` where u.username = '${username}'` : '';
  //     var query = `
  //     SELECT u.*, r.*
  //     FROM NeumenApi.dbo.usuarios u
  //     JOIN NeumenApi.dbo.roles_usuarios ur ON u.id = ur.id_Usuario
  //     JOIN NeumenApi.dbo.roles r ON ur.id_Rol = r.id
  //      ${whereClause}
  //     `;

  //     // Obtener conexión del pool
  //     const pool = await this.sql.getConnection();

  //     try {
  //       // Ejecutar la consulta
  //       const result = await pool.request().query(query);

  //       const roles = result.recordset.map((row) => row.rolNombre);

  //       // Devolver el conjunto de registros

  //       if (result.rowsAffected == 0)
  //         throw new UnauthorizedException('No existe el usuario2');
  //       const passwordOK = await compare(password, result.recordset[0].password);

  //       if (!passwordOK) throw new UnauthorizedException('Contraseña Erronea');

  //       const payload: PayLoadInterface = {
  //         id: result.recordset[0].id[0],
  //         username: result.recordset[0].username,
  //         email: result.recordset[0].email,
  //         roles: roles,
  //       };
  //       //console.log(payload);
  //       const token = await this.jwtService.sign(payload);

  //       return token;
  //     } finally {
  //       // Importante: liberar la conexión de nuevo al pool en la cláusula finally
  //       pool.close();
  //     }

  //     //console.log('usuario: ', usuario);

  //     // if (!usuario) throw new UnauthorizedException('No existe el usuario2');
  //     // const passwordOK = await compare(dto.password, usuario.password);
  //     // //console.log('usuario.password: ', usuario.password);
  //     // //console.log('dto.password: ', dto.password);
  //     // //$2a$10$Cjbo5PmGopuvi7WiFSe3Uu58dnpT2dF1Q0HnaZno9qHeLcypH09Ji

  //     // if (!passwordOK) throw new UnauthorizedException('Contraseña Erronea');
  //     // const payload: PayLoadInterface = {
  //     //   id: usuario.id,
  //     //   username: usuario.username,
  //     //   email: usuario.email,
  //     //   roles: usuario.roles.map((rol) => rol.rolNombre as RolNombre),
  //     // };
  //     // const token = await this.jwtService.sign(payload);
  //     // //console.log(token);
  //     // return token;
  //   }
  async login(dto: LoginUsuarioDto): Promise<any> {
    const { username, password } = dto;
    
    if (username == undefined)
      throw new BadRequestException('Error en envio de datos');
    const whereClause = username ? ` where username = '${username}' or email ='${username}'` : '';
    var query = `
    SELECT *
    FROM NeumenApi.dbo.UsuariosN

     ${whereClause}
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      // Devolver el conjunto de registros
      if (result.rowsAffected == 0)
        throw new UnauthorizedException('No existe el usuario2');

      const passwordOK = await compare(password, result.recordset[0].password);
      console.log(password,result.recordset[0].password);

      if (!passwordOK) throw new UnauthorizedException('Contraseña Erronea');

      const payload: PayLoadInterface = {
        id: result.recordset[0].username,
        username: result.recordset[0].username,
        descri: result.recordset[0].Descri,
        roles: result.recordset[0].Nivel,
        sucursal: result.recordset[0].nrosuc,
      };
      console.log(payload);
      const token = this.jwtService.sign(payload);

      return token;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async refresh(dto: TokenDto): Promise<any> {
    if (!dto.token)
      throw new UnauthorizedException('Token No Encontrado o Ausente');
    const usuario = await this.jwtService.decode(dto.token);
    if (!usuario) throw new UnauthorizedException('Token Inválido o No Válido');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload: PayLoadInterface = {
      id: usuario['id'],
      username: usuario['username'],
      descri: usuario['descri'],
      roles: usuario['roles'],
      sucursal: usuario['sucursal'],
    };
    const token = await this.jwtService.sign(payload);
    // console.log(token);
    return token;
  }
}
