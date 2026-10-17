import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brote } from './brote.entity.js';
import { BrotesController } from './brotes.controller.js';
import { BrotesService } from './brotes.service.js';

@Module({ imports: [TypeOrmModule.forFeature([Brote])], controllers: [BrotesController], providers: [BrotesService], exports: [BrotesService] })
export class BrotesModule {}
