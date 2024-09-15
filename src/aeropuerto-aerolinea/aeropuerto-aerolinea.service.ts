import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../common/exceptions/business-errors';

@Injectable()
export class AeropuertoAerolineaService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private aeropuertoRepository: Repository<AeropuertoEntity>,

        @InjectRepository(AerolineaEntity)
        private aerolineaRepository: Repository<AerolineaEntity>
    ) {}

    // Asociar un aeropuerto a una aerolínea
    async addAirportToAirline(aerolineaId: number, aeropuertoId: number): Promise<AerolineaEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId } });
        if (!aeropuerto)
            throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);

        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ["aeropuertos"],
        });
        if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }

    // Obtener los aeropuertos de una aerolínea
    async findAirportsFromAirline(aerolineaId: number): Promise<AeropuertoEntity[]> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ["aeropuertos"],
        });
        if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        return aerolinea.aeropuertos;
    }

    // Obtener un aeropuerto cubierto por una aerolínea
    async findAirportFromAirline(aerolineaId: number, aeropuertoId: number): Promise<AeropuertoEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ["aeropuertos"],
        });
        if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        const aeropuerto = aerolinea.aeropuertos.find(aeropuerto => aeropuerto.id === aeropuertoId);
        if (!aeropuerto)
            throw new BusinessLogicException("The aeropuerto with the given id is not associated to the aerolinea", BusinessError.NOT_FOUND);

        return aeropuerto;
    }

    // Actualizar los aeropuertos que cubre una aerolínea
    async updateAirportsFromAirline(aerolineaId: number, aeropuertosIds: number[]): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ["aeropuertos"],
        });
        if (!aerolinea)
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);

        const aeropuertos: AeropuertoEntity[] = await this.aeropuertoRepository.findBy({
            id: In(aeropuertosIds),
        });

        if (aeropuertos.length !== aeropuertosIds.length)
            throw new BusinessLogicException("One or more aeropuertos with the given ids were not found", BusinessError.NOT_FOUND);

        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
    }

    // Eliminar todos los aeropuertos que cubre una aerolínea
    async deleteAirportFromAirline(aerolineaId: number, aeropuertoId: number) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId },
            relations: ['aeropuertos'],
        });
        if (!aerolinea) {
            throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
        }
    
        const aeropuerto = aerolinea.aeropuertos.find(aeropuerto => aeropuerto.id === aeropuertoId);
        if (!aeropuerto) {
            throw new BusinessLogicException("The aeropuerto with the given id is not associated to the aerolinea", BusinessError.NOT_FOUND);
        }
        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(aeropuerto => aeropuerto.id !== aeropuertoId);        
        await this.aerolineaRepository.save(aerolinea);
    }
    
}
