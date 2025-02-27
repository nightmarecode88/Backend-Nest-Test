import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API de Películas')
    .setDescription('API para gestionar películas y usuarios')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'node_modules', 'swagger-ui-dist'));

  // Redirigir la raíz a otra ruta o servir una página vacía
  app.use('/', (req, res) => {
    res.send('Bienvenido a la API de Películas');
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
