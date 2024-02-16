import { BadRequestException, Injectable } from '@nestjs/common';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    private readonly sql: MsSqlConnectService,
  ) {}
  create(createMenuDto: CreateMenuDto) {
    return 'This action adds a new menu';
  }

  findAll() {
    return `This action returns all menu`;
  }

  async findOne(filterQuery) {
    const { id } = filterQuery;
    if (!id) throw new BadRequestException("Consulta mal Planteada"); 
    const whereClause =` where IdUsua = '${id}' and Estado ='1' `;
    const query = `
    select * from NeumenApi.dbo.lvw_Menu 
    where IdMenu in( SELECT IdMenu
        FROM NeumenApi.dbo.lvw_MenuUsuario  ${whereClause} )
    `;
    

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      const menus=result.recordset;
      if (!result.recordset.length) return [];

      
      // Devolver el conjunto de registros
      return menus;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
