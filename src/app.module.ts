import { MsSqlConnectService } from './config/mssqlconnect.service';
import { WriteLogService } from './config/writelog.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './usuariosS/users/users.module';
import { configService } from './config/config.service';
import { RolesModule } from './usuariosS/roles/roles.module';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './config/winston-logger.config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { PersonalModule } from './modules/personal/personal.module';

@Module({
  imports: [
    WinstonModule.forRoot(loggerOptions),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    RolesModule,
    PersonalModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    MsSqlConnectService,
  ],
  //exports: [WriteLogService],
})
export class AppModule {}
