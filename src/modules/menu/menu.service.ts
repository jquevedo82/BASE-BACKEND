import { BadRequestException, Injectable } from '@nestjs/common';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly sql: MsSqlConnectService) {}


  
  async create(filterQuery) {
    let { datos } = filterQuery;
    if (!datos) throw new BadRequestException('Consulta mal Planteada 1');
    const query = `
    insert into NeumenApi.dbo.Menu (Padre,IdMenu,Descri,Lnk,Sentencia,Estado) 
    values('${datos}','0000','${datos}','','','1')
    `;
    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    console.log(query);
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      const query2 = `
      select * from NeumenApi.dbo.Menu 
      where IdMenu = '0000'
      `;
      console.log(query2);
      const result2 = await pool.request().query(query2);
      const menus = result2.recordset;
      // Devolver el conjunto de registros
      console.log(menus);
      return menus;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async findAll() {
    const query = `
    select * from NeumenApi.dbo.Menu 
    where IdMenu = '0000'
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      const menus = result.recordset;
      if (!result.recordset.length) return [];

      // Devolver el conjunto de registros
      return menus;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  
  async findAllhijos(id) {
    const query = `
    select Padre from NeumenApi.dbo.Menu 
    where id = '${id}'
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      const padre = result.recordset[0].Padre;
      const query2 = `
      select * from NeumenApi.dbo.Menu 
      where Padre = '${padre}' and IdMenu != '0000'
      `;
      const result2 = await pool.request().query(query2);
      const menus = result2.recordset;
      if (!result.recordset.length) return [];
      
      // Devolver el conjunto de registros
      return menus;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async findOne(filterQuery) {
    const { id } = filterQuery;

    if (!id) throw new BadRequestException('Consulta mal Planteada 1');
    const whereClause = ` where IdUsua = '${id}' and Estado ='1' `;
    const query = `
    select * from NeumenApi.dbo.Menu 
    where IdMenu in( SELECT IdMenu
        FROM NeumenApi.dbo.MenuUsuario  ${whereClause} )
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      const menus = result.recordset;
      if (!result.recordset.length) return [];

      // Devolver el conjunto de registros
      return menus;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async update(id, dato) {
    if (!id) throw new BadRequestException('Consulta mal Planteada 1');
    const whereClause = ` where id = '${id}'`;
    const query = `
    update NeumenApi.dbo.Menu set Descri = '${dato.datos.Descri}'
     ${whereClause} 
    `;
    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);

      // Devolver el conjunto de registros
      return result.rowsAffected;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  async remove(id: number) {
    const query = `
    delete from NeumenApi.dbo.Menu 
    where id = '${id}' 
    `;

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();
    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);
      const menus = result.recordset;

      // Devolver el conjunto de registros
      return menus;
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }
}
