/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
  @ApiProperty({ example:'frase de conexion' })
  token: string;
}
