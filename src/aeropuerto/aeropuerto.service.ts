import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError  } from '../common/exceptions/business-errors'

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private aeropuertoRepository: Repository<AeropuertoEntity>,
    ) {}
    
    // Obtener todos los aeropuertos
    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({relations: ["aerolineas"]});      
    }

    // Obtener un aeropuerto por id
    async findOne(id: number): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}, relations: ["aerolineas"] } );
        if (!aeropuerto)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
    
        return aeropuerto;
    }

    // Crear un aeropuerto
    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    // Actualizar un aeropuerto
    async update(id: number, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const aeropuertoExistente: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}});
        if (!aeropuertoExistente)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    // Eliminar un aeropuerto
    async remove(id: number): Promise<void> {
        const aeropuertoExistente: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}});
        if (!aeropuertoExistente)
          throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
        await this.aeropuertoRepository.remove(aeropuertoExistente);
    }
}
