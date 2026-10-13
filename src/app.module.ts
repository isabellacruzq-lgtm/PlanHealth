import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantasModule } from './plantas/plantas.module.js';
import { SusceptibilidadesModule } from './susceptibilidades/susceptibilidades.module.js';
import { CultivosModule } from './cultivos/cultivos.module.js';
import { Planta } from './plantas/planta.entity.js';
import { Susceptibilidad } from './susceptibilidades/susceptibilidad.entity.js';
import { Cultivo } from './cultivos/cultivo.entity.js';

@Module({
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
        database: config.get<string>('DB_DATABASE', 'breaze_in_the_moon'),
        entities: [Planta, Susceptibilidad, Cultivo],
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
      }),
    }),
    PlantasModule,
    SusceptibilidadesModule,
    CultivosModule,
  ],
})
export class AppModule {}
