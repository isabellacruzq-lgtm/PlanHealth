import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cultivos')
export class Cultivo {
  @PrimaryGeneratedColumn()
  id!: number;

  // ID simple: no se declara relación de TypeORM.
  @Column({ type: 'int' })
  plantaId!: number;

  @Column({ type: 'varchar', length: 100 })
  lote!: string;

  @Column({ type: 'varchar', length: 100 })
  region!: string;

  @Column({ type: 'date' })
  fechaSiembra!: string;

  @Column({ type: 'text' })
  codigoGeneticoSemilla!: string;
}
