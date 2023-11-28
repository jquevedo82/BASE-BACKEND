//import { MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotBlank } from 'src/decorador/is-not-blank.decorator';
/* eslint-disable prettier/prettier */
export class LoginUsuarioDto {
  @ApiProperty({ example:'Email - UserName' })
  @IsNotBlank({ message: 'El nombre de usuario no puede estar vacio' })
  //@MaxLength(10, { message: 'Nombre de Usuario longitud maxima de 10' })
  username: string;

  @ApiProperty({ example:'PassWord - Contraseña' })
  @IsNotBlank({ message: 'La contraseña no puede estar vacia' })
  password: string;
}
