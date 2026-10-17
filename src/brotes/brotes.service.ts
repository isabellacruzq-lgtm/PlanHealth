import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brote } from './brote.entity.js';
import { CreateBroteDto } from './dto/create-brote.dto.js';
import { UpdateBroteDto } from './dto/update-brote.dto.js';

@Injectable()
export class BrotesService {
  constructor(@InjectRepository(Brote) private readonly repo: Repository<Brote>) {}

  private validarId(valor: unknown, campo: string): number {
    const id = Number(valor);
    if (!Number.isInteger(id) || id <= 0) throw new BadRequestException(`${campo} debe ser un entero positivo`);
    return id;
  }
  private validarFecha(valor: unknown): string {
    if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) throw new BadRequestException('fecha debe tener formato YYYY-MM-DD');
    const d = new Date(`${valor}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) throw new BadRequestException('fecha no es válida');
    const hoy = new Date();
    const hoyIso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    if (valor > hoyIso) throw new BadRequestException('fecha no puede ser posterior al día actual');
    return valor;
  }
  private validarRegion(valor: unknown): string {
    if (typeof valor !== 'string' || !valor.trim()) throw new BadRequestException('region es obligatoria');
    if (valor.trim().length > 100) throw new BadRequestException('region no puede superar 100 caracteres');
    return valor.trim();
  }
  private validarHectareas(valor: unknown): number {
    const n = Number(valor);
    if (valor === null || valor === '' || !Number.isFinite(n) || n <= 0) throw new BadRequestException('hectareasAfectadas debe ser un número mayor que cero');
    return n;
  }
  private async validarReferencias(plantaId: number, enfermedadId: number) {
    const [plantas, enfermedades] = await Promise.all([
      this.repo.manager.query('SELECT id FROM plantas WHERE id = ?', [plantaId]),
      this.repo.manager.query('SELECT id FROM enfermedades WHERE id = ?', [enfermedadId]),
    ]);
    if (!plantas.length) throw new NotFoundException(`No existe una planta con ID ${plantaId}`);
    if (!enfermedades.length) throw new NotFoundException(`No existe una enfermedad con ID ${enfermedadId}`);
  }
  async crear(dto: CreateBroteDto) {
    const plantaId = this.validarId(dto.plantaId, 'plantaId');
    const enfermedadId = this.validarId(dto.enfermedadId, 'enfermedadId');
    await this.validarReferencias(plantaId, enfermedadId);
    const datos = { plantaId, enfermedadId, fecha: this.validarFecha(dto.fecha), region: this.validarRegion(dto.region), hectareasAfectadas: this.validarHectareas(dto.hectareasAfectadas) };
    return this.repo.save(this.repo.create(datos));
  }
  async listar(f: { plantaId?: string; enfermedadId?: string; region?: string; desde?: string; hasta?: string }) {
    if (f.desde) this.validarFechaFiltro(f.desde, 'desde');
    if (f.hasta) this.validarFechaFiltro(f.hasta, 'hasta');
    if (f.desde && f.hasta && f.desde > f.hasta) throw new BadRequestException('desde no puede ser posterior a hasta');
    const qb = this.repo.createQueryBuilder('brote');
    if (f.plantaId !== undefined) qb.andWhere('brote.plantaId = :plantaId', { plantaId: this.validarId(f.plantaId, 'plantaId') });
    if (f.enfermedadId !== undefined) qb.andWhere('brote.enfermedadId = :enfermedadId', { enfermedadId: this.validarId(f.enfermedadId, 'enfermedadId') });
    if (f.region) qb.andWhere('brote.region LIKE :region', { region: `%${f.region.trim()}%` });
    if (f.desde) qb.andWhere('brote.fecha >= :desde', { desde: f.desde });
    if (f.hasta) qb.andWhere('brote.fecha <= :hasta', { hasta: f.hasta });
    return qb.orderBy('brote.fecha', 'DESC').addOrderBy('brote.id', 'DESC').getMany();
  }
  private validarFechaFiltro(valor: string, campo: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) throw new BadRequestException(`${campo} debe tener formato YYYY-MM-DD`);
    const d = new Date(`${valor}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) throw new BadRequestException(`${campo} no es una fecha válida`);
  }
  async buscarPorId(id: number) {
    const brote = await this.repo.findOneBy({ id });
    if (!brote) throw new NotFoundException(`No existe un brote con ID ${id}`);
    return brote;
  }
  async actualizar(id: number, dto: UpdateBroteDto) {
    const actual = await this.buscarPorId(id);
    const plantaId = dto.plantaId === undefined ? actual.plantaId : this.validarId(dto.plantaId, 'plantaId');
    const enfermedadId = dto.enfermedadId === undefined ? actual.enfermedadId : this.validarId(dto.enfermedadId, 'enfermedadId');
    await this.validarReferencias(plantaId, enfermedadId);
    if (dto.fecha !== undefined) actual.fecha = this.validarFecha(dto.fecha);
    if (dto.region !== undefined) actual.region = this.validarRegion(dto.region);
    if (dto.hectareasAfectadas !== undefined) actual.hectareasAfectadas = this.validarHectareas(dto.hectareasAfectadas);
    actual.plantaId = plantaId;
    actual.enfermedadId = enfermedadId;
    return this.repo.save(actual);
  }
  async eliminar(id: number) {
    await this.buscarPorId(id);
    await this.repo.delete(id);
    return { mensaje: `Brote ${id} eliminado correctamente` };
  }
  async detalle() {
    const brotes = await this.repo.find({ order: { fecha: 'DESC', id: 'DESC' } });
    const resultado = await Promise.all(brotes.map(async (brote) => {
      const [plantas, enfermedades] = await Promise.all([
        this.repo.manager.query('SELECT id, nombreComun, nombreCientifico FROM plantas WHERE id = ?', [brote.plantaId]),
        this.repo.manager.query('SELECT id, nombre, descripcionSintomas, patogenoId FROM enfermedades WHERE id = ?', [brote.enfermedadId]),
      ]);
      const enfermedad = enfermedades[0] ?? null;
      const patogenos = enfermedad
        ? await this.repo.manager.query('SELECT id, nombre, nombreCientifico, tipo FROM patogenos WHERE id = ?', [enfermedad.patogenoId])
        : [];
      return { ...brote, planta: plantas[0] ?? null, enfermedad: enfermedad ? { ...enfermedad, patogeno: patogenos[0] ?? null } : null };
    }));
    return resultado;
  }
}
