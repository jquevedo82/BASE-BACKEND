import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, ValidationArguments, Validate, isEmail } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'customEmail', async: false })
export class CustomEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    if (email === "") {
      return true; // Permitir una cadena vacía
    }

    return isEmail(email);
  }

  defaultMessage(args: ValidationArguments) {
    return "El email debe ser una cadena vacía o un correo electrónico válido";
  }
}

