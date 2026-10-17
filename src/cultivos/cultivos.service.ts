import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './cultivo.entity.js';
import { CreateCultivoDto } from './dto/create-cultivo.dto.js';
import { UpdateCultivoDto } from './dto/update-cultivo.dto.js';

@Injectable()
export class CultivosService {
  constructor(@InjectRepository(Cultivo) private readonly repo: Repository<Cultivo>) {}

  private idValido(valor: unknown): number {
    const n = Number(valor);
    if (!Number.isInteger(n) || n <= 0) throw new BadRequestException('plantaId debe ser un entero positivo');
    return n;
  }

  private texto(valor: unknown, campo: string, max = 100): string {
    if (typeof valor !== 'string' || !valor.trim()) throw new BadRequestException(`${campo} es obligatorio`);
    const limpio = valor.trim();
    if (limpio.length > max) throw new BadRequestException(`${campo} no puede superar ${max} caracteres`);
    return limpio;
  }

  private secuencia(valor: unknown): string {
    if (typeof valor !== 'string' || !/^[ACGT]+$/.test(valor)) {
      throw new BadRequestException('codigoGeneticoSemilla solo puede contener A, C, G y T mayúsculas y no estar vacío');
    }
    return valor;
  }

  private fecha(valor: unknown): string {
    if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      throw new BadRequestException('fechaSiembra debe tener formato YYYY-MM-DD');
    }
    const date = new Date(`${valor}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== valor) {
      throw new BadRequestException('fechaSiembra no es una fecha válida');
    }
    const hoy = new Date();
    const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    if (valor > hoyISO) throw new BadRequestException('fechaSiembra no puede ser posterior al día actual');
    return valor;
  }

  private async validarPlanta(plantaId: number) {
    const filas = await this.repo.manager.query('SELECT id FROM plantas WHERE id = ?', [plantaId]);
    if (!filas.length) throw new NotFoundException(`No existe una planta con ID ${plantaId}`);
  }

  async crear(dto: CreateCultivoDto) {
    const plantaId = this.idValido(dto.plantaId);
    await this.validarPlanta(plantaId);
    const datos = {
      plantaId,
      lote: this.texto(dto.lote, 'lote'),
      region: this.texto(dto.region, 'region'),
      fechaSiembra: this.fecha(dto.fechaSiembra),
      codigoGeneticoSemilla: this.secuencia(dto.codigoGeneticoSemilla),
    };
    return this.repo.save(this.repo.create(datos));
  }

  async listar(filtros: { plantaId?: string; lote?: string; region?: string; desde?: string; hasta?: string }) {
    const qb = this.repo.createQueryBuilder('cultivo');
    if (filtros.plantaId !== undefined) qb.andWhere('cultivo.plantaId = :plantaId', { plantaId: this.idValido(filtros.plantaId) });
    if (filtros.lote) qb.andWhere('cultivo.lote LIKE :lote', { lote: `%${filtros.lote}%` });
    if (filtros.region) qb.andWhere('cultivo.region LIKE :region', { region: `%${filtros.region}%` });
    if (filtros.desde) {
      const desde = this.fechaSinFuturo(filtros.desde, 'desde');
      qb.andWhere('cultivo.fechaSiembra >= :desde', { desde });
    }
    if (filtros.hasta) {
      const hasta = this.fechaSinFuturo(filtros.hasta, 'hasta');
      qb.andWhere('cultivo.fechaSiembra <= :hasta', { hasta });
    }
    if (filtros.desde && filtros.hasta && filtros.desde > filtros.hasta) {
      throw new BadRequestException('La fecha desde no puede ser posterior a hasta');
    }
    return qb.orderBy('cultivo.id', 'ASC').getMany();
  }

  private fechaSinFuturo(valor: string, campo: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) throw new BadRequestException(`${campo} debe tener formato YYYY-MM-DD`);
    const d = new Date(`${valor}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) throw new BadRequestException(`${campo} no es una fecha válida`);
    return valor;
  }

  async buscarPorId(id: number) {
    const cultivo = await this.repo.findOneBy({ id });
    if (!cultivo) throw new NotFoundException(`No existe un cultivo con ID ${id}`);
    return cultivo;
  }

  async actualizar(id: number, dto: UpdateCultivoDto) {
    const actual = await this.buscarPorId(id);
    const plantaId = dto.plantaId === undefined ? actual.plantaId : this.idValido(dto.plantaId);
    await this.validarPlanta(plantaId);
    if (dto.lote !== undefined) actual.lote = this.texto(dto.lote, 'lote');
    if (dto.region !== undefined) actual.region = this.texto(dto.region, 'region');
    if (dto.fechaSiembra !== undefined) actual.fechaSiembra = this.fecha(dto.fechaSiembra);
    if (dto.codigoGeneticoSemilla !== undefined) actual.codigoGeneticoSemilla = this.secuencia(dto.codigoGeneticoSemilla);
    actual.plantaId = plantaId;
    return this.repo.save(actual);
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);
    await this.repo.delete(id);
    return { mensaje: `Cultivo ${id} eliminado correctamente` };
  }
}
