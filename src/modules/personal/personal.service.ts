import { BadRequestException, Injectable } from '@nestjs/common';
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

    const pool = await this.sql.getConnection();
    try {
      const request = pool.request();
      console.log(sqlQuery);

      const result = await request.query(sqlQuery);

      if (!result.recordset[0]) return null;
      return result.recordset[0];
    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }
  }

  findOne(id: number) {
    return { id };
  }

  update(id: number, updatePersonalDto: UpdatePersonalDto) {
    return `This action updates a #${id} personal`;
  }

  remove(id: number) {
    return { id: id };
  }
}
