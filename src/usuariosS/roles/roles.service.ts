import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    //private readonly rolesRepository: Repository<Rol>,
    private readonly sql: MsSqlConnectService,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const pool = await this.sql.getConnection();

    try {
        // Preparar la consulta con un parámetro
        const query = `
            SELECT *
            FROM NeumenApi.dbo.roles
            WHERE rolNombre = @rolNombre
        `;
    
        // Ejecutar la consulta con un parámetro
        const result = await pool
            .request()
            .input('rolNombre', createRoleDto.rolNombre)
            .query(query);
    
        // Devolver los resultados
        //console.log(result.recordset.length);
       
        if (result.recordset.length==1) throw new ConflictException('El rol que ingresaste ya existe');
        const insertQuery = `
            INSERT INTO NeumenApi.dbo.roles (rolNombre)
            VALUES (@rolNombre)
        `;
        await pool
            .request()
            .input('rolNombre', createRoleDto.rolNombre)
            .query(insertQuery);
    } finally {
        // Importante: liberar la conexión al pool en la cláusula finally
        pool.close();
    }



  }

  async findAll(filterQuery): Promise<Rol[]> {
    const { limit } = filterQuery;

    const topClause = limit ? `TOP ${limit}` : '';
    const query = `
        SELECT ${topClause} *
        FROM NeumenApi.dbo.roles 
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      if (!result.recordset.length) return [];
      // Devolver el conjunto de registros
      return result.recordset;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
