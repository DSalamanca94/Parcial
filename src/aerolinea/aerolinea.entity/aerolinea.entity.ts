import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Entity('aerolinea')
export class AerolineaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  paginaWeb: string;

  @ManyToMany(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas)
  @JoinTable({
    name: 'aerolinea_aeropuerto',
    joinColumn: { name: 'aerolinea_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'aeropuerto_id', referencedColumnName: 'id' },
  })
  aeropuertos: AeropuertoEntity[];
}
