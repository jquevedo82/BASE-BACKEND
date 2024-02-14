import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { WriteLogService } from 'src/config/writelog.service';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService, WriteLogService, MsSqlConnectService]
})
export class PersonalModule {}
