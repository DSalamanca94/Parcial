import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../common/exceptions/business-errors';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;

  const mockAeropuerto = {
    id: 1,
    nombre: 'Aeropuerto 1',
    codigo: 'ABC',
    pais: 'Pais 1',
    ciudad: 'Ciudad 1',
    aerolineas: []
  } as AeropuertoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoService,
        {
          provide: getRepositoryToken(AeropuertoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of aeropuertos', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockAeropuerto]);

      const result = await service.findAll();
      expect(result).toEqual([mockAeropuerto]);
    });
  });

  describe('findOne', () => {
    it('should return a single aeropuerto', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAeropuerto);

      const result = await service.findOne(1);
      expect(result).toEqual(mockAeropuerto);
    });

    it('should throw an exception if aeropuerto is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('create', () => {
    it('should successfully create a new aeropuerto', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockAeropuerto);

      const result = await service.create(mockAeropuerto);
      expect(result).toEqual(mockAeropuerto);
    });
  });

  describe('update', () => {
    it('should successfully update an existing aeropuerto', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAeropuerto);
      jest.spyOn(repository, 'save').mockResolvedValue(mockAeropuerto);

      const result = await service.update(1, mockAeropuerto);
      expect(result).toEqual(mockAeropuerto);
    });

    it('should throw an exception if aeropuerto is not found for update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, mockAeropuerto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('remove', () => {
    it('should successfully remove an aeropuerto', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAeropuerto);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove(1);
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw an exception if aeropuerto is not found for removal', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(BusinessLogicException);
    });
  });
});
