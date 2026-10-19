import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstadisticasService } from './estadisticas.service.js';

@ApiTags('Estadísticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly service: EstadisticasService) {}
  @Get('brotes-por-enfermedad') @ApiOperation({ summary: 'Contar brotes agrupados por enfermedad' }) brotesPorEnfermedad() { return this.service.brotesPorEnfermedad(); }
  @Get('brotes-por-region') @ApiOperation({ summary: 'Contar brotes agrupados por región' }) brotesPorRegion() { return this.service.brotesPorRegion(); }
  @Get('brotes-por-planta') @ApiOperation({ summary: 'Contar brotes agrupados por planta' }) brotesPorPlanta() { return this.service.brotesPorPlanta(); }
  @Get('hectareas-por-enfermedad') @ApiOperation({ summary: 'Sumar hectáreas afectadas por enfermedad' }) hectareasPorEnfermedad() { return this.service.hectareasPorEnfermedad(); }
  @Get('hectareas-por-region') @ApiOperation({ summary: 'Sumar hectáreas afectadas por región' }) hectareasPorRegion() { return this.service.hectareasPorRegion(); }
  @Get('brotes-por-periodo') @ApiOperation({ summary: 'Agrupar brotes por mes, con filtros opcionales desde y hasta' }) brotesPorPeriodo(@Query('desde') desde?: string, @Query('hasta') hasta?: string) { return this.service.brotesPorPeriodo(desde, hasta); }
  @Get('patogenos-mas-problematicos') @ApiOperation({ summary: 'Ordenar patógenos por brotes y hectáreas afectadas' }) patogenosMasProblematicos() { return this.service.patogenosMasProblematicos(); }
}
