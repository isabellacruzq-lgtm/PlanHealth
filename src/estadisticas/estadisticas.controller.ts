import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service.js';

@Controller('estadisticas')
export class EstadisticasController {
    constructor(
        private readonly estadisticasService : EstadisticasService,
    ){}

    @Get('brotes/total')
    contarBrotes(){
        return this.estadisticasService.contarBrotes();
    }

    @Get('brotes/enfermedades')
    brotesPorEnfermedad(){
        return this.estadisticasService.brotesPorEnfermead();
    }

    @Get('brotes/plantas')
    brotesPorPlanta(){
        return this.estadisticasService.brotesPorPlanta()
    }

    @Get('hectareas/region')
    hectareasPorRegion(){
        return this.estadisticasService.hectareasPorRegion();
    }

    @Get('brotes/fecha')
    brotesPorFecha(){
        return this.estadisticasService.brotesPorFecha();
    }

    @Get('brotes/patogenos')
    brotesPorPatogeno(){
        return this.estadisticasService.brotesPorPatogeno();
    }
}
