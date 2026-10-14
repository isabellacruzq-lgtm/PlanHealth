import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patogeno, TipoPatogeno } from './patogeno.entity.js';
import { CreatePatogenoDto } from './dto/create-patogeno.dto.js';
import { UpdatePatogenoDto } from './dto/update-patogeno.dto.js';

@Injectable()
export class PatogenosService {
  constructor(@InjectRepository(Patogeno) private readonly repo: Repository<Patogeno>) {}
  private texto(v: unknown, campo: string, max = 150): string {
    if (typeof v !== 'string' || !v.trim()) throw new BadRequestException(`${campo} es obligatorio`);
    const s = v.trim(); if (s.length > max) throw new BadRequestException(`${campo} no puede superar ${max} caracteres`); return s;
  }
  private tipo(v: unknown): TipoPatogeno {
    if (!Object.values(TipoPatogeno).includes(v as TipoPatogeno)) throw new BadRequestException(`tipo debe ser uno de: ${Object.values(TipoPatogeno).join(', ')}`);
    return v as TipoPatogeno;
  }
  private secuencia(v: unknown): string {
    if (typeof v !== 'string' || !/^[ACGT]+$/.test(v)) throw new BadRequestException('secuenciaGenetica solo puede contener A, C, G y T mayúsculas');
    return v;
  }
  private async validarNombreCientifico(nombre: string, excluirId?: number) {
    const existente = await this.repo.findOneBy({ nombreCientifico: nombre });
    if (existente && existente.id !== excluirId) throw new ConflictException(`Ya existe un patógeno con nombre científico ${nombre}`);
  }
  async crear(dto: CreatePatogenoDto) {
    const datos = { nombre: this.texto(dto.nombre, 'nombre', 100), nombreCientifico: this.texto(dto.nombreCientifico, 'nombreCientifico'), tipo: this.tipo(dto.tipo), transmision: this.texto(dto.transmision, 'transmision'), secuenciaGenetica: this.secuencia(dto.secuenciaGenetica) };
    await this.validarNombreCientifico(datos.nombreCientifico);
    return this.repo.save(this.repo.create(datos));
  }
  async listar(f: { nombre?: string; nombreCientifico?: string; tipo?: string; transmision?: string }) {
    const qb = this.repo.createQueryBuilder('p');
    if (f.nombre) qb.andWhere('p.nombre LIKE :nombre', { nombre: `%${f.nombre}%` });
    if (f.nombreCientifico) qb.andWhere('p.nombreCientifico LIKE :nc', { nc: `%${f.nombreCientifico}%` });
    if (f.tipo) qb.andWhere('p.tipo = :tipo', { tipo: this.tipo(f.tipo) });
    if (f.transmision) qb.andWhere('p.transmision LIKE :transmision', { transmision: `%${f.transmision}%` });
    return qb.orderBy('p.id', 'ASC').getMany();
  }
  async buscarPorId(id: number) { const r = await this.repo.findOneBy({ id }); if (!r) throw new NotFoundException(`No existe un patógeno con ID ${id}`); return r; }
  async actualizar(id: number, dto: UpdatePatogenoDto) {
    const r = await this.buscarPorId(id);
    if (dto.nombre !== undefined) r.nombre = this.texto(dto.nombre, 'nombre', 100);
    if (dto.nombreCientifico !== undefined) { r.nombreCientifico = this.texto(dto.nombreCientifico, 'nombreCientifico'); await this.validarNombreCientifico(r.nombreCientifico, id); }
    if (dto.tipo !== undefined) r.tipo = this.tipo(dto.tipo);
    if (dto.transmision !== undefined) r.transmision = this.texto(dto.transmision, 'transmision');
    if (dto.secuenciaGenetica !== undefined) r.secuenciaGenetica = this.secuencia(dto.secuenciaGenetica);
    return this.repo.save(r);
  }
  async eliminar(id: number) {
    await this.buscarPorId(id);
    const dependientes = await this.repo.manager.query('SELECT id FROM enfermedades WHERE patogenoId = ?', [id]);
    if (dependientes.length) throw new ConflictException('No se puede eliminar el patógeno porque tiene enfermedades asociadas');
    await this.repo.delete(id); return { mensaje: `Patógeno ${id} eliminado correctamente` };
  }
}
