import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateCuentaDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  codigo: number;

  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacío' })
  @MaxLength(100)
  nombre: string;

  @IsInt()
  @Min(1)
  @Max(2147483647)
  naturalezaId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  cuentaPadreId?: number | null;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  active?: boolean;
}
