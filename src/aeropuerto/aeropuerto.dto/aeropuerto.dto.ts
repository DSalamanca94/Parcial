import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class AeropuertoDto {
  
  //@IsNumber()
  //@IsNotEmpty()
  //id: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  //@IsArray()
  //@IsString({ each: true })
  //@IsNotEmpty()
  //aerolineas: string[];
}