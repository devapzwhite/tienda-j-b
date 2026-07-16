import { IsEmail, IsString, MinLength, IsArray, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @IsArray()
  @IsUUID('4', { each: true, message: 'Debe ser un ID de rol válido' })
  roleIds: string[];
}
