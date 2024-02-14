import { Inject, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Usar el logger al instanciar GlobalExceptionFilter
  app.useGlobalFilters();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Neumen REST API')
    .setDescription('API REST desarrollada en Nestjs Con token JWT')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  // La ruta en que se sirve la documentación
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  const configService = app.get(ConfigService);
  //server port
  const port = configService.get<number>('SERVER_PORT');
  app.enableCors(); /// quita error cors
  await app.listen(port);
  console.log(port);
  console.log(`listening on port ${await app.getUrl()}`);
}
bootstrap();
