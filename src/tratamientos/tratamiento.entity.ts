import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoTratamiento { QUIMICO = 'químico', BIOLOGICO = 'biológico', CULTURAL = 'cultural' }

@Entity('tratamientos')
export class Tratamiento {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: 'varchar', length: 120 }) nombre!: string;
  @Column({ type: 'text' }) descripcionAplicacion!: string;
  @Column({ type: 'enum', enum: TipoTratamiento }) tipo!: TipoTratamiento;
  // ID simple intencional: el proyecto no usa relaciones automáticas de TypeORM.
  @Column({ type: 'int' }) enfermedadId!: number;
}
