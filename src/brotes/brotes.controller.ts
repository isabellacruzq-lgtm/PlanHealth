import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BrotesService } from './brotes.service.js';
import { CreateBroteDto } from './dto/create-brote.dto.js';
import { UpdateBroteDto } from './dto/update-brote.dto.js';

@ApiTags('Brotes')
@Controller('brotes')
export class BrotesController {
  constructor(private readonly service: BrotesService) {}
  @Post() @ApiOperation({ summary: 'Registrar un brote' }) crear(@Body() dto: CreateBroteDto) { return this.service.crear(dto); }
  @Get('detalle') @ApiOperation({ summary: 'Listar brotes con planta y enfermedad asociadas' }) detalle() { return this.service.detalle(); }
  @Get() @ApiOperation({ summary: 'Listar y filtrar brotes' }) listar(@Query('plantaId') plantaId?: string, @Query('enfermedadId') enfermedadId?: string, @Query('region') region?: string, @Query('desde') desde?: string, @Query('hasta') hasta?: string) { return this.service.listar({ plantaId, enfermedadId, region, desde, hasta }); }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) { return this.service.buscarPorId(id); }
  @Patch(':id') actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBroteDto) { return this.service.actualizar(id, dto); }
  @Delete(':id') eliminar(@Param('id', ParseIntPipe) id: number) { return this.service.eliminar(id); }
}
