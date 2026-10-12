import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './cultivo.entity.js';
import { CultivosController } from './cultivos.controller.js';
import { CultivosService } from './cultivos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo])],
  controllers: [CultivosController],
  providers: [CultivosService],
  exports: [CultivosService],
})
export class CultivosModule {}
