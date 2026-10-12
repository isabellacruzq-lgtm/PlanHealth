import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Susceptibilidad, NivelSusceptibilidad } from './susceptibilidad.entity.js';
import { CreateSusceptibilidadDto } from './dto/create-susceptibilidad.dto.js';
import { UpdateSusceptibilidadDto } from './dto/update-susceptibilidad.dto.js';

@Injectable()
export class SusceptibilidadesService {
  constructor(
    @InjectRepository(Susceptibilidad) private readonly repo: Repository<Susceptibilidad>,
  ) {}

  private idValido(valor: unknown, campo: string): number {
    const n = Number(valor);
    if (!Number.isInteger(n) || n <= 0) throw new BadRequestException(`${campo} debe ser un entero positivo`);
    return n;
  }

  private nivelValido(valor: unknown): NivelSusceptibilidad {
    if (!Object.values(NivelSusceptibilidad).includes(valor as NivelSusceptibilidad)) {
      throw new BadRequestException(`nivel debe ser uno de estos valores: ${Object.values(NivelSusceptibilidad).join(', ')}`);
    }
    return valor as NivelSusceptibilidad;
  }

  private async validarIds(plantaId: number, enfermedadId: number) {
    const planta = await this.repo.manager.query('SELECT id FROM plantas WHERE id = ?', [plantaId]);
    if (!planta.length) throw new NotFoundException(`No existe una planta con ID ${plantaId}`);
    const enfermedad = await this.repo.manager.query('SELECT id FROM enfermedades WHERE id = ?', [enfermedadId]);
    if (!enfermedad.length) throw new NotFoundException(`No existe una enfermedad con ID ${enfermedadId}`);
  }

  async crear(dto: CreateSusceptibilidadDto) {
    const plantaId = this.idValido(dto.plantaId, 'plantaId');
    const enfermedadId = this.idValido(dto.enfermedadId, 'enfermedadId');
    const nivel = this.nivelValido(dto.nivel);
    await this.validarIds(plantaId, enfermedadId);
    const duplicada = await this.repo.findOneBy({ plantaId, enfermedadId });
    if (duplicada) throw new ConflictException('Ya existe una susceptibilidad para esa planta y enfermedad');
    return this.repo.save(this.repo.create({ plantaId, enfermedadId, nivel }));
  }

  async listar(plantaId?: string, enfermedadId?: string, nivel?: string) {
    const where: Partial<Susceptibilidad> = {};
    if (plantaId !== undefined) where.plantaId = this.idValido(plantaId, 'plantaId');
    if (enfermedadId !== undefined) where.enfermedadId = this.idValido(enfermedadId, 'enfermedadId');
    if (nivel !== undefined) where.nivel = this.nivelValido(nivel);
    return this.repo.find({ where, order: { id: 'ASC' } });
  }

  async buscarPorId(id: number) {
    const registro = await this.repo.findOneBy({ id });
    if (!registro) throw new NotFoundException(`No existe una susceptibilidad con ID ${id}`);
    return registro;
  }

  async actualizar(id: number, dto: UpdateSusceptibilidadDto) {
    const actual = await this.buscarPorId(id);
    const plantaId = dto.plantaId === undefined ? actual.plantaId : this.idValido(dto.plantaId, 'plantaId');
    const enfermedadId = dto.enfermedadId === undefined ? actual.enfermedadId : this.idValido(dto.enfermedadId, 'enfermedadId');
    const nivel = dto.nivel === undefined ? actual.nivel : this.nivelValido(dto.nivel);
    await this.validarIds(plantaId, enfermedadId);
    const duplicada = await this.repo.findOne({
      where: { plantaId, enfermedadId, id: Not(id) },
    });
    if (duplicada) throw new ConflictException('Ya existe una susceptibilidad para esa planta y enfermedad');
    actual.plantaId = plantaId;
    actual.enfermedadId = enfermedadId;
    actual.nivel = nivel;
    return this.repo.save(actual);
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);
    await this.repo.delete(id);
    return { mensaje: `Susceptibilidad ${id} eliminada correctamente` };
  }
}
