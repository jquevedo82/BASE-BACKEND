import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsNotBlank } from 'src/decorador/is-not-blank.decorator';
/* eslint-disable prettier/prettier */
export class NuevoUsuarioDto {
  @ApiProperty({ example: 'Nombre Completo del Usuario' })
  @IsString()
  @MaxLength(50, { message: 'Nombre longitud maxima de 50' })
  nombre: string;

  @ApiProperty({ example: 'UserName' })
  @IsNotBlank({ message: 'El nombre de usuario no puede estar vacio' })
  @MaxLength(10, { message: 'Nombre de Usuario longitud maxima de 10' })
  username: string;

  @ApiProperty({ example: 'Correo Electronico' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Contraseña o Password' })
  @IsNotBlank({ message: 'La contraseña no puede estar vacia' })
  password: string;
 
  @ApiProperty({ example: 'denominacion' })
  @IsNotBlank({ message: 'La contraseña no puede estar vacia' })
  denominacion: string;

  @ApiProperty({ example: 'Nivel' })
  @IsInt({
    message: 'El nivel del usuario',
  })
  nivel: number;

  @ApiProperty({ example: 'true' })
  @IsBoolean({
    message: 'el usuario debe estar activo',
  })
  isActivo: boolean;


}
