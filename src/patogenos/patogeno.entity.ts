import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum TipoPatogeno {
  VIRUS = 'virus', HONGO = 'hongo', OOMICETO = 'oomiceto',
  BACTERIA = 'bacteria', INSECTO = 'insecto', NEMATODO = 'nematodo',
}

@Entity('patogenos')
@Unique('UQ_patogenos_nombre_cientifico', ['nombreCientifico'])
export class Patogeno {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: 'varchar', length: 100 }) nombre!: string;
  @Column({ type: 'varchar', length: 150 }) nombreCientifico!: string;
  @Column({ type: 'enum', enum: TipoPatogeno }) tipo!: TipoPatogeno;
  @Column({ type: 'varchar', length: 150 }) transmision!: string;
  @Column({ type: 'text' }) secuenciaGenetica!: string;
}
