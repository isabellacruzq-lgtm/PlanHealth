import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantasModule } from './plantas/plantas.module.js';
import { SusceptibilidadesModule } from './susceptibilidades/susceptibilidades.module.js';
import { CultivosModule } from './cultivos/cultivos.module.js';
import { PatogenosModule } from './patogenos/patogenos.module.js';
import { EnfermedadesModule } from './enfermedades/enfermedades.module.js';
import { TratamientosModule } from './tratamientos/tratamientos.module.js';
import { BrotesModule } from './brotes/brotes.module.js';
import { ConsultasModule } from './consultas/consultas.module.js';
import { EstadisticasModule } from './estadisticas/estadisticas.module.js';
import { Planta } from './plantas/planta.entity.js';
import { Susceptibilidad } from './susceptibilidades/susceptibilidad.entity.js';
import { Cultivo } from './cultivos/cultivo.entity.js';
import { Patogeno } from './patogenos/patogeno.entity.js';
import { Enfermedad } from './enfermedades/enfermedad.entity.js';
import { Tratamiento } from './tratamientos/tratamiento.entity.js';
import { Brote } from './brotes/brote.entity.js';
import { AppController } from './app.controller.js';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '3306')),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'proyecto_back'),
        entities: [Planta, Susceptibilidad, Cultivo, Patogeno, Enfermedad, Tratamiento, Brote],
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
      }),
    }),
    PlantasModule,
    SusceptibilidadesModule,
    CultivosModule,
    PatogenosModule,
    EnfermedadesModule,
    TratamientosModule,
    BrotesModule,
    ConsultasModule,
    EstadisticasModule,
  ],
})
export class AppModule {}