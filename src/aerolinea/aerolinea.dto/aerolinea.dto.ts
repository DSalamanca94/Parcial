import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsDate, IsArray } from 'class-validator';

export class AerolineaDto {
  //@IsNumber()
  //@IsNotEmpty()
  //id: number;
  
  @IsString()
  @IsNotEmpty()
  nombre: string;
  
  @IsString()
  descripcion: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  fechaFundacion: Date;

  @IsString()
  @IsNotEmpty()
  paginaWeb: string;

  //@IsArray()
  //@IsString({ each: true })
  //@IsNotEmpty()
  //aeropuertos: string[];
}
