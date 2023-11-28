/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
//   canActivate(context: ExecutionContext) {
//     // Coloca aquí la lógica personalizada si es necesario antes de llamar a super.canActivate()
//     console.log(context);
//     return super.canActivate(context);
//   }
}
