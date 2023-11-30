import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../roles/entities/rol.entity';
import { User } from './entities/user.entity';
import { WriteLogService } from 'src/config/writelog.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol])],
  controllers: [UsersController],
  providers: [UsersService, WriteLogService],
})
export class UsersModule {}
