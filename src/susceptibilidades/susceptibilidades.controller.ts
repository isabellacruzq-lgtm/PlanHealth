import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SusceptibilidadesService } from './susceptibilidades.service.js';
import { CreateSusceptibilidadDto } from './dto/create-susceptibilidad.dto.js';
import { UpdateSusceptibilidadDto } from './dto/update-susceptibilidad.dto.js';

@ApiTags('Susceptibilidades')
@Controller('susceptibilidades')
export class SusceptibilidadesController {
  constructor(private readonly service: SusceptibilidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una susceptibilidad' })
  crear(@Body() dto: CreateSusceptibilidadDto) { return this.service.crear(dto); }

  @Get()
  listar(@Query('plantaId') plantaId?: string, @Query('enfermedadId') enfermedadId?: string, @Query('nivel') nivel?: string) {
    return this.service.listar(plantaId, enfermedadId, nivel);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) { return this.service.buscarPorId(id); }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSusceptibilidadDto) { return this.service.actualizar(id, dto); }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) { return this.service.eliminar(id); }
}
