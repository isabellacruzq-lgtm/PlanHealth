import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Estado de la API')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Comprobar que la API está disponible' })
  @ApiOkResponse({ description: 'La API está funcionando' })
  health() {
    return { mensaje: 'PlantHealth API funcionando' };
  }
}