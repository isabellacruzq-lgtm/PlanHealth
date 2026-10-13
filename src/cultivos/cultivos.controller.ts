import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CultivosService } from './cultivos.service.js';
import { CreateCultivoDto } from './dto/create-cultivo.dto.js';
import { UpdateCultivoDto } from './dto/update-cultivo.dto.js';

@ApiTags('Cultivos')
@Controller('cultivos')
export class CultivosController {
  constructor(private readonly service: CultivosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un cultivo' })
  crear(@Body() dto: CreateCultivoDto) { return this.service.crear(dto); }

  @Get()
  listar(@Query('plantaId') plantaId?: string, @Query('lote') lote?: string, @Query('region') region?: string, @Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.service.listar({ plantaId, lote, region, desde, hasta });
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) { return this.service.buscarPorId(id); }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCultivoDto) { return this.service.actualizar(id, dto); }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) { return this.service.eliminar(id); }
}
