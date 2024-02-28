import { BadRequestException, Injectable } from '@nestjs/common';
import { DateFormatService } from 'src/common/services/dateformat.service';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';

@Injectable()
export class PersonalService {
  constructor(
    private readonly sql: MsSqlConnectService,
    private readonly dateFormat: DateFormatService,
  ) {}
  create(createPersonalDto: CreatePersonalDto) {
    return 'This action adds a new personal';
  }

  async findAll(filterQuery: {
    dato: any;
    selects: any;
    where: any;
    limit: any;
    order: any;
  }): Promise<any> {
    let { dato, selects, where, limit, order } = filterQuery;
    let where2: string;

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

  async periodoPrueba(filterQuery): Promise<any> {
    let { dato, limit, order, fechad, fechah } = filterQuery;
    let where2: string, selects: string, where: string;

    console.log(filterQuery);
    // console.log(dato);
    // console.log(fechah);

    selects = `Apellido, Nombres, NroLegaBej, NroLegaVal, NroCui, NroDni,IdSucu,Autorizo, FecIng,FecPrue,
          a.Nombres + ' ' + a.Apellido AS NombreCompleto,
        (select b.Nombres + ' ' + b.Apellido from Vales.dbo.Sueldos_Personal b where a.Autorizo=b.NroLegaVal) as N2,
        (select c.Descri from Vales.dbo.Sueldos_Sucursales c where a.IdSucu=c.IdSucu) as S2,     CASE 
        WHEN Estado = 0 THEN 'Baja'
        else 'Activo'
        
    END AS EstadoTexto 
        `;
    if (dato === undefined) dato = '';
    const datoEnMayusculas = dato.toUpperCase();

    let fechadW = `DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)`;
    fechad = this.dateFormat.formatDate(fechad);
    if (fechad != undefined) {
      fechadW = `'${fechad}'`;
    }

    let fechahW = ` 1 = 1 `;
    fechah = this.dateFormat.formatDate(fechah);
    if (fechah != undefined) fechahW = ` FecPrue <= '${fechah}' `;

    where = ` NroCui != '' and Apellido !=''  and ( FecPrue >= (${fechadW}) and ${fechahW} ) `;

    where2 = ` UPPER(Apellido) LIKE '%${datoEnMayusculas}%' OR UPPER(Nombres) LIKE '%${datoEnMayusculas}%' `;

    if (limit === undefined) limit = 100;
    if (order === undefined) order = ' FecPrue,1, 2 ';

    const sqlQuery = `
    set dateformat dmy
    SELECT TOP ${limit} ${selects}
    FROM Vales.dbo.Sueldos_Personal a
    WHERE ( ${where2} ) AND (${where})
    ORDER BY ${order} ASC;
  `;
    console.log(sqlQuery, 11);
    const pool = await this.sql.getConnection();
    try {
      const request = pool.request();
      // console.log(sqlQuery,12);
      const result = await request.query(sqlQuery);

      if (!result.recordset[0]) return null;
      return await result.recordset;
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
