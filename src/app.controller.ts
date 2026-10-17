import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Estado de la API')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Comprobar que la API está disponible' })
  health() {
    return { mensaje: 'PlanHealth API funcionando' };
  }
}
