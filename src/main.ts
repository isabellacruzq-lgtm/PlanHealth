import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PlantHealth API')
    .setDescription(
      'API REST para la gestión de sanidad vegetal: plantas, patógenos, enfermedades, susceptibilidades, tratamientos, cultivos y brotes.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(Number(process.env.PORT ?? 3000));
}
void bootstrap();
