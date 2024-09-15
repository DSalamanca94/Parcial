import {Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseInterceptors} from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { BusinessErrorsInterceptor } from 'src/common/interceptors/business-errors/business-errors.interceptor';
import { AerolineaDto } from './aerolinea.dto/aerolinea.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
  constructor(private readonly aerolineaService: AerolineaService) {}

  // Obtener todas las aerolíneas
  @Get()
  async findAll(): Promise<AerolineaEntity[]> {
    return await this.aerolineaService.findAll();
  }

  // Obtener una aerolínea por id
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AerolineaEntity> {
    return await this.aerolineaService.findOne(id);
  }

  // Crear una nueva aerolínea
  @Post()
  async create(@Body() aerolineaDto: AerolineaDto): Promise<AerolineaEntity> {
    const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
    return await this.aerolineaService.create(aerolinea);
  }

  // Actualizar una aerolínea por id
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() aerolineaDto: AerolineaDto
  ): Promise<AerolineaEntity> {
    const aerolineaExistente: AerolineaEntity = await this.aerolineaService.findOne(id);

    if (!aerolineaExistente) {
      throw new HttpException(`The airline with the id ${id} was not found`, HttpStatus.NOT_FOUND);
    }

    const aerolineaActualizada: AerolineaEntity = plainToInstance(AerolineaEntity, {
      ...aerolineaExistente,
      ...aerolineaDto,
    });

    return await this.aerolineaService.update(id, aerolineaActualizada);
  }




  // Eliminar una aerolínea por id
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.aerolineaService.remove(id);
  }
}
