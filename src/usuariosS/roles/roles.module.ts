import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol } from './entities/rol.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WriteLogService } from 'src/config/writelog.service';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolesController],
  providers: [RolesService, WriteLogService, MsSqlConnectService],
})
export class RolesModule {}
