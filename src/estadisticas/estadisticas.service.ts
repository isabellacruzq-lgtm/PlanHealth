import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EstadisticasService {
  constructor(private readonly dataSource: DataSource) {}

  async brotesPorEnfermedad() {
    const rows = await this.dataSource.query('SELECT enfermedadId, COUNT(*) AS cantidadBrotes FROM brotes GROUP BY enfermedadId ORDER BY cantidadBrotes DESC');
    return Promise.all(rows.map(async (r: { enfermedadId: number; cantidadBrotes: string | number }) => {
      const enfermedades = await this.dataSource.query('SELECT id, nombre FROM enfermedades WHERE id = ?', [r.enfermedadId]);
      return { enfermedadId: Number(r.enfermedadId), enfermedad: enfermedades[0]?.nombre ?? null, cantidadBrotes: Number(r.cantidadBrotes) };
    }));
  }
  async brotesPorRegion() {
    const rows = await this.dataSource.query(
      'SELECT region, COUNT(*) AS cantidadBrotes FROM brotes GROUP BY region ORDER BY cantidadBrotes DESC',
    );
    return rows.map((row: { region: string; cantidadBrotes: string | number }) => ({
      region: row.region,
      cantidadBrotes: Number(row.cantidadBrotes),
    }));
  }
  async brotesPorPlanta() {
    const rows = await this.dataSource.query('SELECT plantaId, COUNT(*) AS cantidadBrotes FROM brotes GROUP BY plantaId ORDER BY cantidadBrotes DESC');
    return Promise.all(rows.map(async (r: { plantaId: number; cantidadBrotes: string | number }) => {
      const plantas = await this.dataSource.query('SELECT id, nombreComun, nombreCientifico FROM plantas WHERE id = ?', [r.plantaId]);
      return { plantaId: Number(r.plantaId), planta: plantas[0] ?? null, cantidadBrotes: Number(r.cantidadBrotes) };
    }));
  }
  async hectareasPorEnfermedad() {
    const rows = await this.dataSource.query('SELECT enfermedadId, SUM(hectareasAfectadas) AS hectareasAfectadas, COUNT(*) AS cantidadBrotes FROM brotes GROUP BY enfermedadId ORDER BY hectareasAfectadas DESC');
    return Promise.all(rows.map(async (r: { enfermedadId: number; hectareasAfectadas: string | number; cantidadBrotes: string | number }) => {
      const enfermedades = await this.dataSource.query('SELECT id, nombre FROM enfermedades WHERE id = ?', [r.enfermedadId]);
      return { enfermedadId: Number(r.enfermedadId), enfermedad: enfermedades[0]?.nombre ?? null, hectareasAfectadas: Number(r.hectareasAfectadas), cantidadBrotes: Number(r.cantidadBrotes) };
    }));
  }
  hectareasPorRegion() {
    return this.dataSource.query(
      'SELECT region, COUNT(*) AS cantidadBrotes, SUM(hectareasAfectadas) AS hectareasAfectadas FROM brotes GROUP BY region ORDER BY hectareasAfectadas DESC',
    ).then((rows: { region: string; cantidadBrotes: string | number; hectareasAfectadas: string | number }[]) =>
      rows.map((row) => ({
        region: row.region,
        cantidadBrotes: Number(row.cantidadBrotes),
        hectareasAfectadas: Number(row.hectareasAfectadas),
      })),
    );
  }

  async brotesPorPeriodo(desde?: string, hasta?: string) {
    this.validarRango(desde, hasta);
    const conditions: string[] = [];
    const params: string[] = [];
    if (desde) { conditions.push('fecha >= ?'); params.push(desde); }
    if (hasta) { conditions.push('fecha <= ?'); params.push(hasta); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return this.dataSource.query(`SELECT DATE_FORMAT(fecha, '%Y-%m') AS periodo, COUNT(*) AS cantidadBrotes, SUM(hectareasAfectadas) AS hectareasAfectadas FROM brotes ${where} GROUP BY DATE_FORMAT(fecha, '%Y-%m') ORDER BY periodo`, params);
  }
  async patogenosMasProblematicos() {
    const brotesPorEnfermedad = await this.dataSource.query('SELECT enfermedadId, COUNT(*) AS cantidadBrotes, SUM(hectareasAfectadas) AS hectareasAfectadas FROM brotes GROUP BY enfermedadId');
    const enfermedades = await this.dataSource.query('SELECT id, nombre, patogenoId FROM enfermedades');
    const patogenos = await this.dataSource.query('SELECT id, nombre, nombreCientifico, tipo FROM patogenos');
    const acumulado = new Map<number, { cantidadBrotes: number; hectareasAfectadas: number; enfermedades: Set<string> }>();
    for (const fila of brotesPorEnfermedad as { enfermedadId: number; cantidadBrotes: string | number; hectareasAfectadas: string | number }[]) {
      const enfermedad = (enfermedades as { id: number; nombre: string; patogenoId: number }[]).find((e) => Number(e.id) === Number(fila.enfermedadId));
      if (!enfermedad) continue;
      const previo = acumulado.get(Number(enfermedad.patogenoId)) ?? { cantidadBrotes: 0, hectareasAfectadas: 0, enfermedades: new Set<string>() };
      previo.cantidadBrotes += Number(fila.cantidadBrotes);
      previo.hectareasAfectadas += Number(fila.hectareasAfectadas);
      previo.enfermedades.add(enfermedad.nombre);
      acumulado.set(Number(enfermedad.patogenoId), previo);
    }
    return (patogenos as { id: number; nombre: string; nombreCientifico: string; tipo: string }[]).map((p) => {
      const datos = acumulado.get(Number(p.id)) ?? { cantidadBrotes: 0, hectareasAfectadas: 0, enfermedades: new Set<string>() };
      return { patogeno: p, cantidadBrotes: datos.cantidadBrotes, hectareasAfectadas: Number(datos.hectareasAfectadas.toFixed(2)), enfermedadesAsociadas: [...datos.enfermedades] };
    }).sort((a, b) => b.cantidadBrotes - a.cantidadBrotes || b.hectareasAfectadas - a.hectareasAfectadas);
  }
  private validarRango(desde?: string, hasta?: string) {
    const validar = (v: string, campo: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new BadRequestException(`${campo} debe tener formato YYYY-MM-DD`);
      const d = new Date(`${v}T00:00:00Z`);
      if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) throw new BadRequestException(`${campo} no es una fecha válida`);
    };
    if (desde) validar(desde, 'desde');
    if (hasta) validar(hasta, 'hasta');
    if (desde && hasta && desde > hasta) throw new BadRequestException('desde no puede ser posterior a hasta');
  }
}
