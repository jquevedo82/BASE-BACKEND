import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { Repository } from 'typeorm';
import { RolNombre } from '../roles/entities/rol.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sql: MsSqlConnectService,
  ) {}

  async create(dto: CreateUserDto): Promise<any> {
    const { username, email } = dto;
    const whereClause =
      username && email ? `username = ${username} and email = ${email}` : '';
    var query = `
        SELECT *
        FROM NeumenApi.dbo.roles ${whereClause}
    `;
    var result;
    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      result = await pool.request().query(query);
      if (result.recordset.length == 1)
        throw new BadRequestException('El usuario que ingresaste ya existe');

      query = `
      SELECT *
      FROM NeumenApi.dbo.roles
      WHERE rolNombre = @rolNombre
  `;

      // Ejecutar la consulta con un parámetro
      result = await pool
        .request()
        .input('rolNombre', RolNombre.USER)
        .query(query);

      if (result.recordset.length == 0)
        throw new BadRequestException('los roles no han sido creados');

      const user = {
        // Asegúrate de asignar las propiedades correctas según tu modelo de usuario
        username: dto.username,
        roles: [result.recordset],
        email: dto.email,
        nombre: dto.nombre,
        password: dto.password,
        denominacion: dto.denominacion,
        //isActivo: dto.isActivo,
        nivel: dto.nivel,

        // ... otras propiedades del usuario
      };

      const insertQuery = `
      INSERT INTO NeumenApi.dbo.roles (rolNombre, otrasColumnas)
      VALUES (@rolNombre, @otrasColumnas)
  `;
      const nuevo = await pool
        .request()
        .input('nombre', user.nombre)
        .input('username', user.username)
        .input('email', user.email)
        .input('password', user.password)
        .input('denominacion', user.denominacion)
        .input('nivel', user.nivel)
        //.input('isActivo', user.isActivo)
        .input('id_Rol', user.roles)
        .query(insertQuery);
      return nuevo;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async findAll(filterQuery): Promise<User[]> {
    const { limit } = filterQuery;
    const users = await this.userRepository.find({
      take: limit,
    });
    if (!users.length) return [];

    return users;
  }

  async findByName(filterQuery): Promise<User> {
    const { name } = filterQuery;
    const user = await this.userRepository.findOne({
      where: { username: name },
    });
    if (!user) return null;

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) return null;

    return user;
  }

  async update(
    codigoId: number,
    updateUsuarioDto: UpdateUserDto,
  ): Promise<any> {
    // puedo seleccionar de updateUsuarioDto los atributos q solo quiero actualizar
    // const newU: UpdateUserDto = { nivel: 2, denominacion: 'Prueba' };
    console.log(updateUsuarioDto);
    if (Object.keys(updateUsuarioDto).length === 0)
      throw new ConflictException('No actuliza ningun dato');

    const toUpdate = await this.userRepository.findOne({
      where: { id: codigoId },
    });

    if (!toUpdate) throw new ConflictException('User no encontrado');

    const updated = Object.assign(toUpdate, updateUsuarioDto);

    const updateU = await this.userRepository.save(updated);
    //console.log('s: ', s);
    //return updated;
    return updateU;
  }

  async remove(usuarioId: number): Promise<any> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) throw new ConflictException('EL Usuario No existe');

    const remove = await this.userRepository.remove(usuario);
    return remove;
  }

  async remove2(usuarioId: number): Promise<any> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) throw new ConflictException('EL Usuario No existe');

    usuario.isActivo = false;
    const disabled = await this.userRepository.save(usuario);
    return disabled;
  }
}
