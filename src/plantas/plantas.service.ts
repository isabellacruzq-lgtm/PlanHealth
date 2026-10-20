
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Planta, TipoCultivo } from './planta.entity.js';
import { CreatePlantaDto } from './dto/create-planta.dto.js';
import { UpdatePlantaDto } from './dto/update-planta.dto.js';

@Injectable()
export class PlantasService {
  constructor(
    @InjectRepository(Planta)
    private readonly plantasRepo: Repository<Planta>,
  ) {}

  private textoObligatorio(
    valor: unknown,
    campo: string,
    max: number,
  ): string {
    if (typeof valor !== 'string' || valor.trim().length === 0) {
      throw new BadRequestException(
        `${campo} es obligatorio y debe ser texto`,
      );
    }

    const limpio = valor.trim();

    if (limpio.length > max) {
      throw new BadRequestException(
        `${campo} no puede superar ${max} caracteres`,
      );
    }

    return limpio;
  }

  private validarSecuencia(valor: unknown): string {
    if (typeof valor !== 'string' || !/^[ACGT]+$/.test(valor)) {
      throw new BadRequestException(
        'secuenciaGenetica debe contener únicamente A, C, G y T en mayúsculas y no puede estar vacía',
      );
    }

    return valor;
  }

  private validarTipo(valor: unknown): TipoCultivo {
    if (!Object.values(TipoCultivo).includes(valor as TipoCultivo)) {
      throw new BadRequestException(
        `tipoCultivo debe ser uno de estos valores: ${Object.values(TipoCultivo).join(', ')}`,
      );
    }

    return valor as TipoCultivo;
  }

  private async validarNombreCientificoUnico(
    nombre: string,
    excluirId?: number,
  ) {
    const existente = await this.plantasRepo.findOne({
      where: {
        nombreCientifico: nombre,
        ...(excluirId !== undefined ? { id: Not(excluirId) } : {}),
      },
    });

    if (existente) {
      throw new ConflictException(
        'Ya existe una planta con ese nombre científico',
      );
    }
  }

  async crear(dto: CreatePlantaDto) {
    const datos = {
      nombreComun: this.textoObligatorio(
        dto.nombreComun,
        'nombreComun',
        100,
      ),
      nombreCientifico: this.textoObligatorio(
        dto.nombreCientifico,
        'nombreCientifico',
        150,
      ),
      familiaBotanica: this.textoObligatorio(
        dto.familiaBotanica,
        'familiaBotanica',
        100,
      ),
      tipoCultivo: this.validarTipo(dto.tipoCultivo),
      secuenciaGenetica: this.validarSecuencia(dto.secuenciaGenetica),
    };

    await this.validarNombreCientificoUnico(datos.nombreCientifico);

    return this.plantasRepo.save(this.plantasRepo.create(datos));
  }

  async listar(filtros: {
    nombreComun?: string;
    familiaBotanica?: string;
    tipoCultivo?: string;
  }) {
    const qb = this.plantasRepo.createQueryBuilder('planta');

    // Consulta únicamente la tabla plantas, sin relaciones ni JOIN.
    if (filtros.nombreComun) {
      qb.andWhere('planta.nombreComun LIKE :nombre', {
        nombre: `%${filtros.nombreComun}%`,
      });
    }

    if (filtros.familiaBotanica) {
      qb.andWhere('planta.familiaBotanica LIKE :familia', {
        familia: `%${filtros.familiaBotanica}%`,
      });
    }

    if (filtros.tipoCultivo) {
      qb.andWhere('planta.tipoCultivo = :tipo', {
        tipo: this.validarTipo(filtros.tipoCultivo),
      });
    }

    return qb.orderBy('planta.id', 'ASC').getMany();
  }

  async buscarPorId(id: number) {
    const planta = await this.plantasRepo.findOneBy({ id });

    if (!planta) {
      throw new NotFoundException(
        `No existe una planta con ID ${id}`,
      );
    }

    return planta;
  }

  async actualizar(id: number, dto: UpdatePlantaDto) {
    const actual = await this.buscarPorId(id);
    const datos: Partial<Planta> = {};

    if (dto.nombreComun !== undefined) {
      datos.nombreComun = this.textoObligatorio(
        dto.nombreComun,
        'nombreComun',
        100,
      );
    }

    if (dto.nombreCientifico !== undefined) {
      datos.nombreCientifico = this.textoObligatorio(
        dto.nombreCientifico,
        'nombreCientifico',
        150,
      );

      await this.validarNombreCientificoUnico(
        datos.nombreCientifico,
        id,
      );
    }

    if (dto.familiaBotanica !== undefined) {
      datos.familiaBotanica = this.textoObligatorio(
        dto.familiaBotanica,
        'familiaBotanica',
        100,
      );
    }

    if (dto.tipoCultivo !== undefined) {
      datos.tipoCultivo = this.validarTipo(dto.tipoCultivo);
    }

    if (dto.secuenciaGenetica !== undefined) {
      datos.secuenciaGenetica = this.validarSecuencia(
        dto.secuenciaGenetica,
      );
    }

    Object.assign(actual, datos);

    return this.plantasRepo.save(actual);
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);

    // Comprueba si existen registros relacionados.
    // LIMIT 1 evita recuperar más registros de los necesarios.
    const [susceptibilidades, cultivos, brotes] = await Promise.all([
      this.plantasRepo.manager.query(
        'SELECT id FROM susceptibilidades WHERE plantaId = ? LIMIT 1',
        [id],
      ),
      this.plantasRepo.manager.query(
        'SELECT id FROM cultivos WHERE plantaId = ? LIMIT 1',
        [id],
      ),
      this.plantasRepo.manager.query(
        'SELECT id FROM brotes WHERE plantaId = ? LIMIT 1',
        [id],
      ),
    ]);

    const dependencias: string[] = [];

    if (susceptibilidades.length > 0) {
      dependencias.push('susceptibilidades');
    }

    if (cultivos.length > 0) {
      dependencias.push('cultivos');
    }

    if (brotes.length > 0) {
      dependencias.push('brotes');
    }

    if (dependencias.length > 0) {
      throw new ConflictException(
        `No se puede eliminar la planta porque tiene registros asociados en: ${dependencias.join(', ')}`,
      );
    }

    await this.plantasRepo.delete(id);

    return {
      mensaje: `Planta ${id} eliminada correctamente`,
    };
  }
}
