import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultasService } from './consultas.service.js';

@ApiTags('Consultas compuestas y genética')
@Controller()
export class ConsultasController {
  constructor(private readonly service: ConsultasService) {}
  @Get('plantas/:id/enfermedades') @ApiOperation({ summary: 'Consultar una planta y las enfermedades asociadas por susceptibilidad' }) plantaEnfermedades(@Param('id', ParseIntPipe) id: number) { return this.service.plantaConEnfermedades(id); }
  @Get('patogenos/:id/enfermedades') @ApiOperation({ summary: 'Consultar un patógeno y las enfermedades que causa' }) patogenoEnfermedades(@Param('id', ParseIntPipe) id: number) { return this.service.patogenoConEnfermedades(id); }
  @Get('consultas/brotes/detalle') @ApiOperation({ summary: 'Consultar brotes con planta, enfermedad y patógeno' }) brotesDetalle() { return this.service.brotesDetalle(); }
  @Get('cultivos/:id/mutaciones') @ApiOperation({ summary: 'Comparar la secuencia genética de la planta con la semilla del cultivo' }) mutaciones(@Param('id', ParseIntPipe) id: number) { return this.service.mutacionesCultivo(id); }
  @Get('cultivos/:id/detalle') @ApiOperation({ summary: 'Consultar cultivo, planta y verificación genética' }) cultivoDetalle(@Param('id', ParseIntPipe) id: number) { return this.service.cultivoDetalle(id); }
}
