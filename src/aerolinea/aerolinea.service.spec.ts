import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../common/exceptions/business-errors';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;

  const mockAerolinea = {
    id: 1,
    nombre: 'Aerolinea 1',
    descripcion: 'Descripcion de aerolinea 1',
    fechaFundacion: new Date(),
    paginaWeb: 'http://aerolinea1.com',
    aeropuertos: []
  } as AerolineaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaService,
        {
          provide: getRepositoryToken(AerolineaEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of aerolineas', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockAerolinea]);

      const result = await service.findAll();
      expect(result).toEqual([mockAerolinea]);
    });
  });

  describe('findOne', () => {
    it('should return a single aerolinea', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAerolinea);

      const result = await service.findOne(1);
      expect(result).toEqual(mockAerolinea);
    });

    it('should throw an exception if aerolinea is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('create', () => {
    it('should successfully create a new aerolinea', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockAerolinea);

      const result = await service.create(mockAerolinea);
      expect(result).toEqual(mockAerolinea);
    });
  });

  describe('update', () => {
    it('should successfully update an existing aerolinea', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAerolinea);
      jest.spyOn(repository, 'save').mockResolvedValue(mockAerolinea);

      const result = await service.update(1, mockAerolinea);
      expect(result).toEqual(mockAerolinea);
    });

    it('should throw an exception if aerolinea is not found for update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, mockAerolinea)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('remove', () => {
    it('should successfully remove an aerolinea', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockAerolinea);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove(1);
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw an exception if aerolinea is not found for removal', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(BusinessLogicException);
    });
  });
});
