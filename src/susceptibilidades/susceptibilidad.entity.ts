import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum NivelSusceptibilidad {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

@Entity('susceptibilidades')
@Unique('UQ_susceptibilidad_planta_enfermedad', ['plantaId', 'enfermedadId'])
export class Susceptibilidad {
  @PrimaryGeneratedColumn()
  id!: number;

  // Son columnas ID simples; no usar decoradores de relación de TypeORM.
  @Column({ type: 'int' })
  plantaId!: number;

  @Column({ type: 'int' })
  enfermedadId!: number;

  @Column({ type: 'enum', enum: NivelSusceptibilidad })
  nivel!: NivelSusceptibilidad;
}
