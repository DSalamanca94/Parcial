import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, NotFoundException, UseInterceptors, Res } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoDto } from './aeropuerto.dto/aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/common/interceptors/business-errors/business-errors.interceptor';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
  constructor(private readonly aeropuertoService: AeropuertoService) {}

  // Obtener todos los aeropuertos
  @Get()
  async findAll(): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoService.findAll();
  }

  // Obtener un aeropuerto por su ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AeropuertoEntity> {
    return await this.aeropuertoService.findOne(id);
  }

  // Crear un nuevo aeropuerto
  @Post()
  async create(@Body() aeropuertoDto: AeropuertoDto): Promise<AeropuertoEntity> {
    const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
    return await this.aeropuertoService.create(aeropuerto);
  }

  // Actualizar un aeropuerto por su ID
  @Put(':id')
  async update(
    @Param('id') id: number, 
    @Body() aeropuertoDto: AeropuertoDto
  ): Promise<AeropuertoEntity> {

    const aeropuertoExistente: AeropuertoEntity = await this.aeropuertoService.findOne(id);
    
    if (!aeropuertoExistente) {
      throw new NotFoundException(`The airport with the id ${id} was not found`);
    }

    const aeropuertoActualizado: AeropuertoEntity = plainToInstance(AeropuertoEntity, {
      ...aeropuertoExistente,  
      ...aeropuertoDto,        
    });
  
    return await this.aeropuertoService.update(id, aeropuertoActualizado);
  }
  
  // Eliminar un aeropuerto por su ID
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res): Promise<void> {
   await this.aeropuertoService.remove(id);
   return res.status(204).send();
  }
}
