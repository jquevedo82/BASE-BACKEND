/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constants';
import { PayLoadInterface } from '../payload.interface';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly sql: MsSqlConnectService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: PayLoadInterface) {
    
   // return { userId: payload.id, username: payload.username };
    const { username, email } = payload;
    
    const whereClause =
      username && email
        ? ` where username = '${username}' and email = '${email}'`
        : '';
    var query = `
        SELECT *
        FROM NeumenApi.dbo.usuarios ${whereClause}
    `;
        

    // Obtener conexión del pool
    const pool = await this.sql.getConnection();

    try {
      // Ejecutar la consulta
      const result = await pool.request().query(query);

      // Devolver el conjunto de registros
      //console.log(payload);
      if (!result)
            return new UnauthorizedException(('credenciales erroneas'));
      return payload;

    } finally {
      // Importante: liberar la conexión de nuevo al pool en la cláusula finally
      pool.close();
    }

  }
}
