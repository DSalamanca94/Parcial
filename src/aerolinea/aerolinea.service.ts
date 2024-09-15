import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../common/exceptions/business-errors';

@Injectable()
export class AerolineaService {

    constructor(
        @InjectRepository(AerolineaEntity)
        private aerolineaRepository: Repository<AerolineaEntity>,
    ) {}

    // Obtener todas las aerolíneas
    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({relations: ["aeropuertos"]});
    }

    // Obtener una aerolínea por id
    async findOne(id: number): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
   
        return aerolinea;
    }

    // Crear una aerolínea
    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.save(aerolinea);
    }

    // Actualizar una aerolínea
    async update(id: number, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolineaExistente: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolineaExistente)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);

        // Actualizamos el objeto existente con los nuevos datos
        return await this.aerolineaRepository.save({ ...aerolineaExistente, ...aerolinea });
    }

    // Eliminar una aerolínea
    async remove(id: number): Promise<void> {
        const aerolineaExistente: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolineaExistente)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        
        await this.aerolineaRepository.remove(aerolineaExistente);
    }

}
