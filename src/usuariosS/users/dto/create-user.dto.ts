import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { CustomEmailConstraint } from 'src/decorador/CustomEmailConstraint';
import { IsNotBlank } from '../../../decorador/is-not-blank.decorator';
/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @ApiProperty({ example: 'UserName' })
  @IsNotBlank({ message: 'El nombre de usuario no puede estar vacio' })
  @MaxLength(10, { message: 'Nombre de Usuario longitud maxima de 10' })
  username: string;

  @ApiProperty({ example: 'Correo Electronico' })
  @IsOptional()
  @IsOptional()
  @Validate(CustomEmailConstraint)
  email?: string;

  @ApiProperty({ example: 'Contraseña o Password' })
  @IsNotBlank({ message: 'La contraseña no puede estar vacia' })
  password: string;

  @ApiProperty({ example: 'Descri' })
  @IsNotBlank({ message: 'La denominacion no puede estar vacia' })
  Descri: string;

  @ApiProperty({ example: 'Nivel' })
  //@IsInt({
  // message: 'El nivel del usuario',
  //})
  nivel: number;

  @ApiProperty({ example: 'true' })
  Estado: boolean;
}
