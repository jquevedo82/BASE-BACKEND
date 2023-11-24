
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../../decorador/is-not-blank.decorator';
/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @ApiProperty( {example: 'Nombre del Usuario'})
  @IsString()
  @MaxLength(15, { message: 'Nombre longitud maxima de 15' })
  nombre: string;

  @ApiProperty( {example: 'UserName'})
  @IsNotBlank({ message: 'El nombre de usuario no puede estar vacio' })
  @MaxLength(10, { message: 'Nombre de Usuario longitud maxima de 10' })
  username: string;

  @ApiProperty( {example: 'Correo Electronico'})
  @IsEmail()
  email: string;

  @ApiProperty( {example: 'Contraseña o PassWord'})
  @IsNotBlank({ message: 'La contraseña no puede estar vacia' })
  password: string;

  @ApiProperty( {example: 'Nivel'})
  @IsNotBlank({ message: 'El nivel de autorizacion del usuario no puede estar vacio' })
  nivel: number;

  @ApiProperty( {example: 'Denominacion'})
  @IsNotBlank({ message: 'La denominacion no puede estar vacia' })
  denominacion: string;

}
