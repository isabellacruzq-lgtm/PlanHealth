import { Module } from '@nestjs/common';
import { BrotesService } from './brotes.service.js';
import { BrotesController } from './brotes.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brote } from './entities/brote.entity.js';

@Module({
  imports: [
TypeOrmModule.forFeature([Brote])
  ],
  controllers: [BrotesController],
  providers: [BrotesService],
})
export class BrotesModule {}
