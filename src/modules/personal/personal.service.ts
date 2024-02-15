import { Injectable } from '@nestjs/common';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';

@Injectable()
export class PersonalService {
  constructor(private readonly sql: MsSqlConnectService) {}
  create(createPersonalDto: CreatePersonalDto) {
    return 'This action adds a new personal';
  }


  async findAll(filterQuery): Promise<any> {
    let { dato, selects, where, limit, order } = filterQuery;
    let where2;
   

    if (selects === undefined)
      selects = ' Apellido, Nombres, NroLegaBej, NroLegaVal, NroCui, NroDni ';
    if (dato === undefined) dato = '';
    const datoEnMayusculas = dato.toUpperCase();
    if (where === undefined)
      where = "Estado = '1' and NroCui != '' and Apellido !=''";
    if (where2 === undefined)
      where2 = ` UPPER(Apellido) LIKE '%${datoEnMayusculas}%' OR UPPER(Nombres) LIKE '%${datoEnMayusculas}%' `;
    if (limit === undefined) limit = 100;
    if (order === undefined) order = ' 1, 2 ';

    const sqlQuery = `
    SELECT TOP ${limit} ${selects}
    FROM Vales.dbo.Sueldos_Personal
    WHERE ( ${where2} ) AND (${where})
    ORDER BY ${order} ASC;
  `;

    const sqlCount = `
  SELECT count (*) as total
  FROM Vales.dbo.Sueldos_Personal
  WHERE ( ${where2} ) AND (${where})
  ;
`;


    const pool = await this.sql.getConnection();
    try {
      const request2 = pool.request();
      const result2 = await request2.query(sqlCount);
      // Ejecutar la consulta
      const request = pool.request();
      const result = await request.query(sqlQuery);
      return {
        total: result2.recordset[0].total,
        limit: result.rowsAffected[0],
        results: result.recordset,
      };
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  findOne(id: number) {
    return {id};
  }

  update(id: number, updatePersonalDto: UpdatePersonalDto) {
    return `This action updates a #${id} personal`;
  }

  remove(id: number) {
    return {"id":id};
  }
}
