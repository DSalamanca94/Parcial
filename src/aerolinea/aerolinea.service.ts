import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError  } from '../common/exceptions/business-errors'

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private aerolineaRepository: Repository<AerolineaEntity>,
    ) {}

    // Obtener todas aerolineas
    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({relations: ["aeropuerto"]});
    }

    // Obtener un aerolinea por id
    async findOne(id: number): Promise<AerolineaEntity> {
        const restaurante: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["culturaGastronomica"] } );
        if (!restaurante)
          throw new BusinessLogicException("The restaurante with the given id was not found", BusinessError.NOT_FOUND);
   
        return restaurante;
    }

    // Crear una aerolinea
    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.save(aerolinea);
    }

    // Actualizar una aerolinea
    async update(id: number, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolineaExistente: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}});
        if (!aerolineaExistente)
          throw new BusinessLogicException("The restaurante with the given id was not found", BusinessError.NOT_FOUND);
        return await this.aerolineaRepository.save(aerolinea);
    }

    // Eliminar una aerolinea
    async remove(id: number): Promise<void> {
        const aerolineaExistente: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}});
        if (!aerolineaExistente)
          throw new BusinessLogicException("The restaurante with the given id was not found", BusinessError.NOT_FOUND);
        await this.aerolineaRepository.remove(aerolineaExistente);
    }


}
