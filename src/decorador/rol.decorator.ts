/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
export const RolDecorator = (...roles: string[]) => SetMetadata('roles', roles);
