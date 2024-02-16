import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { WriteLogService } from 'src/config/writelog.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, MsSqlConnectService, WriteLogService],
  imports: [],
})
export class MenuModule {}
