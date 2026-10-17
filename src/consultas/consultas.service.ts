import { Injectable, NotFoundException } from '@nestjs/common';
import { compareGeneticSequences } from '../common/genetics.js';
import { DataSource } from 'typeorm';

@Injectable()
export class ConsultasService {
  constructor(private readonly dataSource: DataSource) {}

  async plantaConEnfermedades(plantaId: number) {
    const plantas = await this.dataSource.query('SELECT * FROM plantas WHERE id = ?', [plantaId]);
    if (!plantas.length) throw new NotFoundException(`No existe una planta con ID ${plantaId}`);
    const susceptibilidades = await this.dataSource.query('SELECT id, plantaId, enfermedadId, nivel FROM susceptibilidades WHERE plantaId = ? ORDER BY id', [plantaId]);
    const enfermedades = await Promise.all(susceptibilidades.map(async (s: { enfermedadId: number; nivel: string; id: number }) => {
      const rows = await this.dataSource.query('SELECT * FROM enfermedades WHERE id = ?', [s.enfermedadId]);
      const enfermedad = rows[0] ?? null;
      const tratamientos = enfermedad
        ? await this.dataSource.query('SELECT id, nombre, descripcionAplicacion, tipo FROM tratamientos WHERE enfermedadId = ? ORDER BY id', [s.enfermedadId])
        : [];
      return { susceptibilidadId: s.id, nivel: s.nivel, enfermedad, tratamientos };
    }));
    const [cultivos, brotes] = await Promise.all([
      this.dataSource.query('SELECT * FROM cultivos WHERE plantaId = ? ORDER BY fechaSiembra DESC, id DESC', [plantaId]),
      this.dataSource.query('SELECT * FROM brotes WHERE plantaId = ? ORDER BY fecha DESC, id DESC', [plantaId]),
    ]);
    return { planta: plantas[0], enfermedades, cultivos, brotes };
  }

  async patogenoConEnfermedades(patogenoId: number) {
    const patogenos = await this.dataSource.query('SELECT * FROM patogenos WHERE id = ?', [patogenoId]);
    if (!patogenos.length) throw new NotFoundException(`No existe un patógeno con ID ${patogenoId}`);
    const enfermedades = await this.dataSource.query('SELECT * FROM enfermedades WHERE patogenoId = ? ORDER BY id', [patogenoId]);
    return { patogeno: patogenos[0], enfermedades };
  }

  async cultivoDetalle(cultivoId: number) {
    const cultivos = await this.dataSource.query('SELECT * FROM cultivos WHERE id = ?', [cultivoId]);
    if (!cultivos.length) throw new NotFoundException(`No existe un cultivo con ID ${cultivoId}`);
    const cultivo = cultivos[0] as { id: number; plantaId: number; codigoGeneticoSemilla: string };
    const plantas = await this.dataSource.query('SELECT * FROM plantas WHERE id = ?', [cultivo.plantaId]);
    if (!plantas.length) throw new NotFoundException(`El cultivo ${cultivoId} referencia una planta inexistente`);
    const planta = plantas[0] as { id: number; secuenciaGenetica: string };
    const mutaciones = this.calcularMutaciones(cultivo.id, planta.secuenciaGenetica, cultivo.codigoGeneticoSemilla);
    return { cultivo, planta: plantas[0], verificacionGenetica: mutaciones };
  }

  async mutacionesCultivo(cultivoId: number) {
    const cultivos = await this.dataSource.query('SELECT * FROM cultivos WHERE id = ?', [cultivoId]);
    if (!cultivos.length) throw new NotFoundException(`No existe un cultivo con ID ${cultivoId}`);
    const cultivo = cultivos[0] as { id: number; plantaId: number; codigoGeneticoSemilla: string };
    const plantas = await this.dataSource.query('SELECT id, secuenciaGenetica FROM plantas WHERE id = ?', [cultivo.plantaId]);
    if (!plantas.length) throw new NotFoundException(`El cultivo ${cultivoId} referencia una planta inexistente`);
    const planta = plantas[0] as { id: number; secuenciaGenetica: string };
    return this.calcularMutaciones(cultivo.id, planta.secuenciaGenetica, cultivo.codigoGeneticoSemilla);
  }


  async brotesDetalle() {
    const brotes = await this.dataSource.query('SELECT * FROM brotes ORDER BY fecha DESC, id DESC');
    return Promise.all(brotes.map(async (brote: { plantaId: number; enfermedadId: number }) => {
      const [plantas, enfermedades] = await Promise.all([
        this.dataSource.query('SELECT * FROM plantas WHERE id = ?', [brote.plantaId]),
        this.dataSource.query('SELECT * FROM enfermedades WHERE id = ?', [brote.enfermedadId]),
      ]);
      const enfermedad = enfermedades[0] as { patogenoId: number } | undefined;
      const patogenos = enfermedad ? await this.dataSource.query('SELECT * FROM patogenos WHERE id = ?', [enfermedad.patogenoId]) : [];
      return { ...brote, planta: plantas[0] ?? null, enfermedad: enfermedades[0] ?? null, patogeno: patogenos[0] ?? null };
    }));
  }

  private calcularMutaciones(cultivoId: number, referencia: string, semilla: string) {
    return compareGeneticSequences(cultivoId, referencia, semilla);
  }
}
