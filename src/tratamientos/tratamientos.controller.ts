import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TratamientosService } from './tratamientos.service.js';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto.js';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto.js';
@ApiTags('Tratamientos')
@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly service:TratamientosService){}
  @Post() @ApiOperation({summary:'Registrar un tratamiento'}) crear(@Body() dto:CreateTratamientoDto){return this.service.crear(dto);}
  @Get() @ApiOperation({summary:'Listar y filtrar tratamientos'}) listar(@Query('tipo') tipo?:string,@Query('enfermedadId') enfermedadId?:string,@Query('nombre') nombre?:string){return this.service.listar({tipo,enfermedadId,nombre});}
  @Get(':id') buscar(@Param('id',ParseIntPipe) id:number){return this.service.buscarPorId(id);}
  @Patch(':id') actualizar(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdateTratamientoDto){return this.service.actualizar(id,dto);}
  @Delete(':id') eliminar(@Param('id',ParseIntPipe) id:number){return this.service.eliminar(id);}
}
