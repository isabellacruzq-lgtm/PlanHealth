import { Injectable } from '@nestjs/common';
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
  ){}

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
    return `This action returns all brotes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brote`;
  }

  update(id: number, updateBroteDto: UpdateBroteDto) {
    return `This action updates a #${id} brote`;
  }

  remove(id: number) {
    return `This action removes a #${id} brote`;
  }
}
