import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum TipoCultivo {
  HORTALIZA = 'hortaliza',
  FRUTAL = 'frutal',
  CEREAL = 'cereal',
  ORNAMENTAL = 'ornamental',
  OTRO = 'otro',
}

@Entity('plantas')
@Unique('UQ_plantas_nombre_cientifico', ['nombreCientifico'])
export class Planta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombreComun!: string;

  @Column({ type: 'varchar', length: 150 })
  nombreCientifico!: string;

  @Column({ type: 'varchar', length: 100 })
  familiaBotanica!: string;

  @Column({ type: 'enum', enum: TipoCultivo })
  tipoCultivo!: TipoCultivo;

  @Column({ type: 'text' })
  secuenciaGenetica!: string;
}
