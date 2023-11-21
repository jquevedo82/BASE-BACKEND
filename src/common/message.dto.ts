/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class MessageDto {
  @ApiProperty({ example: 'Mensaje de Informacion' })
  message: string[]=[];
  constructor(message: string) {
    this.message[0] = message;
  }
}
