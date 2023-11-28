/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constants';
import { PayLoadInterface } from '../payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly authRepositoy: Repository<User>,
    private readonly configService: ConfigService,
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
    
    const usuario = await this.authRepositoy.findOne({
      where: [{ username: username }, { email: email }],
    });
   // console.log(usuario);
    if (!usuario)
          return new UnauthorizedException(('credenciales erroneas'));
    return payload;
  }
}
