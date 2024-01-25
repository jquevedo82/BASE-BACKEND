import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Rol } from 'src/usuariosS/roles/entities/rol.entity';
import { User } from 'src/usuariosS/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'src/config/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WinstonLogger } from 'nest-winston';
import { WriteLogService } from 'src/config/writelog.service';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    JwtStrategy,
    WriteLogService,
    MsSqlConnectService,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
