/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RolNombre } from '../entities/rol.enum';

export class CreateRoleDto {

  @ApiProperty({
    description: `A list of user's roles`,
    example: ['admin','user',"users"],
  })
  @IsEnum(RolNombre, { message: 'El Rol solo puede ser user o admin' })
  rolNombre: RolNombre;
}
