import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { WriteLogService } from 'src/config/writelog.service';
import { MsSqlConnectService } from 'src/config/mssqlconnect.service';
import { DateFormatService } from 'src/common/services/dateformat.service';

@Module({
  controllers: [PersonalController],
  providers: [PersonalService, WriteLogService, MsSqlConnectService,DateFormatService]
})
export class PersonalModule {}
