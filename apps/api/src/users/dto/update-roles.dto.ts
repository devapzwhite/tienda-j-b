import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateRolesDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe proporcionar al menos un rol' })
  @IsString({ each: true, message: 'Cada rol debe ser un string válido' })
  roleIds: string[];
}
