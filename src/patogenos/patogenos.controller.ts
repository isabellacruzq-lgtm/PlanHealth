import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PatogenosService } from './patogenos.service.js';
import { CreatePatogenoDto } from './dto/create-patogeno.dto.js';
import { UpdatePatogenoDto } from './dto/update-patogeno.dto.js';
@ApiTags('Patógenos')
@Controller('patogenos')
export class PatogenosController {
  constructor(private readonly service: PatogenosService) {}
  @Post() @ApiOperation({ summary: 'Registrar un patógeno' }) crear(@Body() dto: CreatePatogenoDto) { return this.service.crear(dto); }
  @Get() @ApiOperation({ summary: 'Listar y filtrar patógenos' }) @ApiQuery({ name: 'tipo', required: false }) listar(@Query('nombre') nombre?: string, @Query('nombreCientifico') nombreCientifico?: string, @Query('tipo') tipo?: string, @Query('transmision') transmision?: string) { return this.service.listar({ nombre, nombreCientifico, tipo, transmision }); }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) { return this.service.buscarPorId(id); }
  @Patch(':id') actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePatogenoDto) { return this.service.actualizar(id, dto); }
  @Delete(':id') eliminar(@Param('id', ParseIntPipe) id: number) { return this.service.eliminar(id); }
}
