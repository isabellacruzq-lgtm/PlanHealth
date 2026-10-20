import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlantasService } from './plantas.service.js';
import { CreatePlantaDto } from './dto/create-planta.dto.js';
import { UpdatePlantaDto } from './dto/update-planta.dto.js';

@ApiTags('Plantas')
@Controller('plantas')
export class PlantasController {
  

  @Post()
  @ApiOperation({ summary: 'Registrar una planta' })
  crear(@Body() dto: CreatePlantaDto) { return this.plantasService.crear(dto); }

  @Get()
  @ApiOperation({ summary: 'Listar y filtrar plantas' })
  listar(@Query('nombreComun') nombreComun?: string, @Query('familiaBotanica') familiaBotanica?: string, @Query('tipoCultivo') tipoCultivo?: string) {
    return this.plantasService.listar({ nombreComun, familiaBotanica, tipoCultivo });
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) { return this.plantasService.buscarPorId(id); }

  @Patch(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlantaDto) { return this.plantasService.actualizar(id, dto); }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) { return this.plantasService.eliminar(id); }
}
