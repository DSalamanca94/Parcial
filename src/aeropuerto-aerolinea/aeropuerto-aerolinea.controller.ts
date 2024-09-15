import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, Res } from '@nestjs/common';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { BusinessErrorsInterceptor } from 'src/common/interceptors/business-errors/business-errors.interceptor';

@Controller('airlines/:airlineId/airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoAerolineaController {
  constructor(private readonly aeropuertoAerolineaService: AeropuertoAerolineaService) {}

  // Asociar un aeropuerto a una aerolínea
  @Post(':airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number
  ): Promise<AerolineaEntity> {
    return await this.aeropuertoAerolineaService.addAirportToAirline(airlineId, airportId);
  }

  // Obtener todos los aeropuertos asociados a una aerolínea
  @Get()
  async findAirportsFromAirline(@Param('airlineId') airlineId: number): Promise<AeropuertoEntity[]> {
    return await this.aeropuertoAerolineaService.findAirportsFromAirline(airlineId);
  }

  // Obtener un aeropuerto específico asociado a una aerolínea
  @Get(':airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number
  ): Promise<AeropuertoEntity> {
    return await this.aeropuertoAerolineaService.findAirportFromAirline(airlineId, airportId);
  }

  // Actualizar los aeropuertos asociados a una aerolínea
  @Put()
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: number,
    @Body('airportIds') airportIds: number[]
  ): Promise<AerolineaEntity> {
    return await this.aeropuertoAerolineaService.updateAirportsFromAirline(airlineId, airportIds);
  }

  // Eliminar un aeropuerto de una aerolínea
  @Delete(':airportId')
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: number,
    @Param('airportId') airportId: number, 
    @Res() res
  ): Promise<void> {
    await this.aeropuertoAerolineaService.deleteAirportFromAirline(airlineId, airportId);
    return res.status(204).send();
  }
}
