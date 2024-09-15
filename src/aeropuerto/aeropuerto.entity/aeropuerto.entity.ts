import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity/aerolinea.entity';

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
  @JoinTable()
  aerolineas: AerolineaEntity[];
}

