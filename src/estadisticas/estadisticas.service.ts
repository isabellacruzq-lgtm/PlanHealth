
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brote } from '../brotes/entities/brote.entity.js';
import { Planta } from '../plantas/planta.entity.js';
import { Enfermedad } from '../enfermedades/enfermedad.entity.js';
import { Patogeno } from '../patogenos/patogeno.entity.js';

@Injectable()
export class EstadisticasService {
  constructor(
    
    @InjectRepository(Brote)
    private broteRepository: Repository<Brote>,

    @InjectRepository(Planta)
    private plantaRepository: Repository<Planta>,

    @InjectRepository(Enfermedad)
    private enfermedadRepository: Repository<Enfermedad>,

    @InjectRepository(Patogeno)
    private patogenoRepository: Repository<Patogeno>,
  ) {}
  async contarBrotes(){
    const total = await this.broteRepository.count();

    return {
        totalBrotes: total,
    };
  }

  async brotesPorEnfermead(){
    return this.broteRepository
    .createQueryBuilder('brote')
    .select('brote.enfermedadId', 'enfermedadId')
    .addSelect('COUNT(brote.id', 'totalBrotes')
    .groupBy('brote.enfermedadId')
    .orderBy('COUNT(brote.id', 'DESC')
    .getRawMany();
}

  async brotesPorPlanta() {
    return this.broteRepository
      .createQueryBuilder('brote')
      .select('brote.plantaId', 'plantaId')
      .addSelect('COUNT(brote.id)', 'totalBrotes')
      .groupBy('brote.plantaId')
      .orderBy('COUNT(brote.id)', 'DESC')
      .getRawMany();
  }

  async hectareasPorRegion() {
    return this.broteRepository
      .createQueryBuilder('brote')
      .select('brote.region', 'region')
      .addSelect('SUM(brote.hectareasAfectadas)', 'totalHectareas')
      .groupBy('brote.region')
      .orderBy('SUM(brote.hectareasAfectadas)', 'DESC')
      .getRawMany();
  }

  
async brotesPorFecha() {
  return this.broteRepository
    .createQueryBuilder('brote')
    .select('brote.fecha', 'fecha')
    .addSelect('COUNT(brote.id)', 'totalBrotes')
    .groupBy('brote.fecha')
    .orderBy('brote.fecha', 'ASC')
    .getRawMany();
}
    async brotesPorPatogeno(){
        return this.broteRepository
        .createQueryBuilder('brote')
        .innerJoin(
            Enfermedad,
            'enfermedad',
            'enfermedad.id = brote.enfermedadId',
        )
        .innerJoin(
            Patogeno,
            'patogeno',
            'patogeno.id = enfermedad.patogenoId',
        )
        .select('patogeno.id', 'patogenoId')
        .addSelect('patogeno.nombre', 'nombrePatogeno')
        .addSelect(('COUNT(brote.id)'), 'totalBrotes')
        .groupBy('patogeno.id')
        .addGroupBy('patogeno.nombre')
        .orderBy('COUNT(brote.id', 'DESC')
        .getRawMany();

    }

}
