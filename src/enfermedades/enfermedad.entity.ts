import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EpocaRiesgo {
  PRIMAVERA = 'primavera', VERANO = 'verano', OTONO = 'otoño',
  INVIERNO = 'invierno', TODO_EL_ANO = 'todo_el_año',
}

@Entity('enfermedades')
export class Enfermedad {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: 'varchar', length: 120 }) nombre!: string;
  @Column({ type: 'text' }) descripcionSintomas!: string;
  @Column({ type: 'enum', enum: EpocaRiesgo }) epocaRiesgo!: EpocaRiesgo;
  // ID simple intencional: el proyecto no usa relaciones automáticas de TypeORM.
  @Column({ type: 'int' }) patogenoId!: number;
}
