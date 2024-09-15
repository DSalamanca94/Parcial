import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../common/exceptions/business-errors';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;

  const mockAerolinea = {
    id: 1,
    nombre: 'Aerolinea 1',
    aeropuertos: [],
  } as AerolineaEntity;

  const mockAeropuerto = {
    id: 1,
    nombre: 'Aeropuerto 1',
    codigo: 'ABC',
  } as AeropuertoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoAerolineaService,
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AerolineaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(AeropuertoAerolineaService);
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should associate an airport to an airline', async () => {
      jest.spyOn(aeropuertoRepository, 'findOne').mockResolvedValue(mockAeropuerto);
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(mockAerolinea);
      jest.spyOn(aerolineaRepository, 'save').mockResolvedValue(mockAerolinea);

      const result = await service.addAirportToAirline(1, 1);

      expect(result.aeropuertos.length).toBe(1);
      expect(result.aeropuertos[0].nombre).toEqual('Aeropuerto 1');
    });

    it('should throw an exception if the aeropuerto is not found', async () => {
      jest.spyOn(aeropuertoRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addAirportToAirline(1, 1)).rejects.toThrow(BusinessLogicException);
    });

    it('should throw an exception if the aerolinea is not found', async () => {
      jest.spyOn(aeropuertoRepository, 'findOne').mockResolvedValue(mockAeropuerto);
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addAirportToAirline(1, 1)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return airports associated with an airline', async () => {
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: [mockAeropuerto] };
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(aerolineaWithAirports);

      const result = await service.findAirportsFromAirline(1);
      expect(result.length).toBe(1);
      expect(result[0].nombre).toEqual('Aeropuerto 1');
    });

    it('should throw an exception if the aerolinea is not found', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findAirportsFromAirline(1)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should disassociate an airport from an airline', async () => {
      const aerolineaWithAirports = { ...mockAerolinea, aeropuertos: [mockAeropuerto] };
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(aerolineaWithAirports);
      jest.spyOn(aerolineaRepository, 'save').mockResolvedValue(mockAerolinea);

      await service.deleteAirportFromAirline(1, 1);
      expect(aerolineaWithAirports.aeropuertos.length).toBe(0);
    });

    it('should throw an exception if the aerolinea is not found', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteAirportFromAirline(1, 1)).rejects.toThrow(BusinessLogicException);
    });

    it('should throw an exception if the aeropuerto is not associated with the airline', async () => {
      const aerolineaWithoutAirports = { ...mockAerolinea, aeropuertos: [] };
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(aerolineaWithoutAirports);
    
      await expect(service.deleteAirportFromAirline(1, 1)).rejects.toThrow(BusinessLogicException);
    });
  });


});
