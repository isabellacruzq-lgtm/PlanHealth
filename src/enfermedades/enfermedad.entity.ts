import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EpocaRiesgo {
  PRIMAVERA = 'primavera',
  VERANO = 'verano',
  OTONO = 'otoño',
  INVIERNO = 'invierno',
  TODO_EL_ANO = 'todo_el_año',
}

@Entity('enfermedades')
export class Enfermedad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ type: 'text' })
  descripcionSintomas!: string;

  @Column({
    type: 'enum',
    enum: EpocaRiesgo,
  })
  epocaRiesgo!: EpocaRiesgo;

  @Column({ type: 'int' })
  patogenoId!: number;
}