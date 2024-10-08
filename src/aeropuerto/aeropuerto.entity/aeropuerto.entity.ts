import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AerolineaEntity } from '../../aerolinea/aerolinea.entity/aerolinea.entity';

@Entity('aeropuerto')
export class AeropuertoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @ManyToMany(() => AerolineaEntity, (aerolinea) => aerolinea.aeropuertos)
  @JoinTable({
    name: 'aeropuerto_aerolinea',
    joinColumn: { name: 'aeropuerto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'aerolinea_id', referencedColumnName: 'id' },
  })
  aerolineas: AerolineaEntity[];
}

