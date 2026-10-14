import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
 Query,
} from '@nestjs/common';

import { EnfermedadesService } from '../enfermedades/enfermedades.service.js';
import { CreateEnfermedadDto } from '../enfermedades/dto/create-enfermedad.dto.js';
import { UpdateEnfermedadDto } from '../enfermedades/dto/update-enfermedad.dto.js';
import { FiltrarEnfermedadesDto } from '../enfermedades/dto/filtrar-enfermedades.dto.js';

@Controller('enfermedades')
export class EnfermedadesController {
  constructor(
    private readonly enfermedadesService: EnfermedadesService,
  ) {}

  @Post()
  create(@Body() dto: CreateEnfermedadDto) {
    return this.enfermedadesService.create(dto);
  }

  @Get()
  findAll(@Query() filtros: FiltrarEnfermedadesDto) {
    return this.enfermedadesService.findAll(filtros);
  }

  @Get(':id/patogeno')
  findOneConPatogeno(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.enfermedadesService.findOneConPatogeno(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enfermedadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnfermedadDto,
  ) {
    return this.enfermedadesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enfermedadesService.remove(id);
  }
}