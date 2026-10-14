import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patogeno } from '../patogenos/patogeno.entity.js';
import { Tratamiento } from '../tratamientos/tratamiento.entity.js';

import { Enfermedad } from '../enfermedades/enfermedad.entity.js';
import { CreateEnfermedadDto } from '../enfermedades/dto/create-enfermedad.dto.js';
import { UpdateEnfermedadDto } from '../enfermedades/dto/update-enfermedad.dto.js';
import { FiltrarEnfermedadesDto } from '../enfermedades/dto/filtrar-enfermedades.dto.js';

@Injectable()
export class EnfermedadesService {
  constructor(
    @InjectRepository(Enfermedad)
    private readonly enfermedadesRepository: Repository<Enfermedad>,

    @InjectRepository(Patogeno)
    private readonly patogenosRepository: Repository<Patogeno>,

    @InjectRepository(Tratamiento)
    private readonly tratamientosRepository: Repository<Tratamiento>,
  ) {}

  private async validarPatogeno(id: number): Promise<void> {
    const existe = await this.patogenosRepository.existsBy({
      id,
    });

    if (!existe) {
      throw new BadRequestException(
        `El patógeno con ID ${id} no existe`,
      );
    }
  }

  async create(dto: CreateEnfermedadDto) {
    await this.validarPatogeno(dto.patogenoId);

    const enfermedad = this.enfermedadesRepository.create({
      nombre: dto.nombre.trim(),
      descripcionSintomas: dto.descripcionSintomas.trim(),
      epocaRiesgo: dto.epocaRiesgo,
      patogenoId: dto.patogenoId,
    });

    return this.enfermedadesRepository.save(enfermedad);
  }

  findAll(filtros: FiltrarEnfermedadesDto) {
    const consulta =
      this.enfermedadesRepository.createQueryBuilder('enfermedad');

    if (filtros.nombre !== undefined) {
      consulta.andWhere(
        'LOCATE(LOWER(:nombre), LOWER(enfermedad.nombre)) > 0',
        {
          nombre: filtros.nombre.trim(),
        },
      );
    }

    if (filtros.epocaRiesgo !== undefined) {
      consulta.andWhere(
        'enfermedad.epocaRiesgo = :epocaRiesgo',
        {
          epocaRiesgo: filtros.epocaRiesgo,
        },
      );
    }

    if (filtros.patogenoId !== undefined) {
      consulta.andWhere(
        'enfermedad.patogenoId = :patogenoId',
        {
          patogenoId: filtros.patogenoId,
        },
      );
    }

    return consulta
      .orderBy('enfermedad.id', 'ASC')
      .getMany();
  }

  async findOne(id: number) {
    const enfermedad =
      await this.enfermedadesRepository.findOneBy({
        id,
      });

    if (!enfermedad) {
      throw new NotFoundException(
        `La enfermedad con ID ${id} no existe`,
      );
    }

    return enfermedad;
  }

  async findOneConPatogeno(id: number) {
    // Primera consulta: buscar la enfermedad.
    const enfermedad = await this.findOne(id);

    // Segunda consulta: buscar el patógeno por su ID.
    const patogeno = await this.patogenosRepository.findOneBy({
      id: enfermedad.patogenoId,
    });

    if (!patogeno) {
      throw new ConflictException(
        `La enfermedad referencia al patógeno ${enfermedad.patogenoId}, pero este ya no existe`,
      );
    }

    // Se construye una respuesta; no se agrega una relación a la entidad.
    return {
      enfermedad: {
        id: enfermedad.id,
        nombre: enfermedad.nombre,
        descripcionSintomas: enfermedad.descripcionSintomas,
        epocaRiesgo: enfermedad.epocaRiesgo,
        patogenoId: enfermedad.patogenoId,
      },
      patogeno: {
        ...patogeno,
      },
    };
  }

  async update(id: number, dto: UpdateEnfermedadDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'Debes enviar al menos un campo para actualizar',
      );
    }

    const enfermedad = await this.findOne(id);

    if (dto.patogenoId !== undefined) {
      await this.validarPatogeno(dto.patogenoId);
      enfermedad.patogenoId = dto.patogenoId;
    }

    if (dto.nombre !== undefined) {
      enfermedad.nombre = dto.nombre.trim();
    }

    if (dto.descripcionSintomas !== undefined) {
      enfermedad.descripcionSintomas =
        dto.descripcionSintomas.trim();
    }

    if (dto.epocaRiesgo !== undefined) {
      enfermedad.epocaRiesgo = dto.epocaRiesgo;
    }

    return this.enfermedadesRepository.save(enfermedad);
  }

  async remove(id: number) {
    const enfermedad = await this.findOne(id);

    const tieneTratamientos =
      await this.tratamientosRepository.existsBy({
        enfermedadId: id,
      });

    if (tieneTratamientos) {
      throw new ConflictException(
        'No puedes eliminar una enfermedad con tratamientos asociados',
      );
    }

    await this.enfermedadesRepository.remove(enfermedad);

    return {
      mensaje: 'Enfermedad eliminada correctamente',
    };
  }
}