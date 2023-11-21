import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//import { configService } from 'src/config/config.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  //server port
  const port = configService.get<number>('SERVER_PORT');
  await app.listen(port);
  console.log(port);
  console.log(`listening on port ${await app.getUrl()}`);
}
bootstrap();
