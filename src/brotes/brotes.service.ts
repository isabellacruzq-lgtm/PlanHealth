
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBroteDto } from './dto/create-brote.dto.js';
import { UpdateBroteDto } from './dto/update-brote.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brote } from './entities/brote.entity.js';


@Injectable()
export class BrotesService {
  constructor(
    @InjectRepository(Brote)
    private readonly broteRepository: Repository<Brote>
  ) { }

  async create(createBroteDto: CreateBroteDto) {
    try {
      const newBrote = this.broteRepository.create(createBroteDto);
      await this.broteRepository.save(newBrote)

      return newBrote;
    } catch (error) {
      return error
    }

  }

  findAll() {
    return this.broteRepository.find();
  }

  private async buscarBrote(id: number) {
    const brote = await this.broteRepository.findOneBy({id});

    if (!brote){
      throw new NotFoundException('El brote no existe');
    }
    return brote;
  }

  async findOne(id : number){
    return this.buscarBrote(id)
  }

  async update(id: number, updateBroteDto: UpdateBroteDto) {
    const brote = await this.buscarBrote(id);
    
    if (updateBroteDto.hectareasAfectadas !== undefined) {
      if (updateBroteDto.hectareasAfectadas <= 0) {
        throw new BadRequestException(
          "Las hectareas afectadas deben ser mayores que 0"
        );
      }
    }

    if (updateBroteDto.region !== undefined) {
      if (typeof updateBroteDto.region !== 'string') {
        throw new BadRequestException('La región debe ser texto');
      } else if (updateBroteDto.region.trim() === '') {
        throw new BadRequestException('La región no puede estar vacía');
      }
    }

    this.broteRepository.merge(brote, updateBroteDto);

    const today = new Date()
    if (updateBroteDto?.fecha && updateBroteDto?.fecha.getTime() > today.getTime()) {
      throw new BadRequestException('La fecha del brote no puede ser futura')
    }
    return await this.broteRepository.save({
      ...brote,
      fecha: new Date(brote.fecha).toISOString().split("T")[0]
    });

  }

  async remove(id: number) {
    const brote = await this.buscarBrote(id);

    await this.broteRepository.remove(brote);

    return {
      message: 'Brote eliminado correctamente',
    };
  }
}
