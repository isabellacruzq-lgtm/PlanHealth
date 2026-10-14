import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnfermedadesService } from './enfermedades.service.js';
import { CreateEnfermedadDto } from './dto/create-enfermedad.dto.js';
import { UpdateEnfermedadDto } from './dto/update-enfermedad.dto.js';
@ApiTags('Enfermedades')
@Controller('enfermedades')
export class EnfermedadesController {
  constructor(private readonly service: EnfermedadesService) {}
  @Post() @ApiOperation({ summary: 'Registrar una enfermedad' }) crear(@Body() dto:CreateEnfermedadDto){return this.service.crear(dto);}
  @Get() @ApiOperation({ summary: 'Listar y filtrar enfermedades' }) listar(@Query('nombre') nombre?:string,@Query('epocaRiesgo') epocaRiesgo?:string,@Query('patogenoId') patogenoId?:string){return this.service.listar({nombre,epocaRiesgo,patogenoId});}
  @Get(':id/detalle') @ApiOperation({ summary: 'Consultar enfermedad, patógeno causante y tratamientos' }) detalle(@Param('id',ParseIntPipe) id:number){return this.service.detalle(id);}
  @Get(':id') buscar(@Param('id',ParseIntPipe) id:number){return this.service.buscarPorId(id);}
  @Patch(':id') actualizar(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdateEnfermedadDto){return this.service.actualizar(id,dto);}
  @Delete(':id') eliminar(@Param('id',ParseIntPipe) id:number){return this.service.eliminar(id);}
}
