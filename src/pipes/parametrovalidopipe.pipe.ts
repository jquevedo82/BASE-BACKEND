/*
https://docs.nestjs.com/pipes
*/

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParametroValidoPipePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if ((metadata.type === 'query' || metadata.type === 'param') && !value) {
      throw new BadRequestException(
        'El parámetro id es requerido en la solicitud GET.',
      );
    }

    return value;
  }
}
