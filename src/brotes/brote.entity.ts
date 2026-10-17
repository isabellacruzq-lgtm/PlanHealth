import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brotes')
export class Brote {
  @PrimaryGeneratedColumn()
  id!: number;

  // IDs simples: las relaciones se consultan manualmente, sin decoradores TypeORM.
  @Column({ type: 'int' })
  plantaId!: number;

  @Column({ type: 'int' })
  enfermedadId!: number;

  @Column({ type: 'date' })
  fecha!: string;

  @Column({ type: 'varchar', length: 100 })
  region!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  hectareasAfectadas!: number;
}
