import { NestFactory } from '@nestjs/core';
import { CptModule } from './cpt.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CptModule);
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Crypto Price Tracker API') // API Title
    .setDescription('Track Crypto price, get notifications, set alert and more')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // API Docs URL: /api-docs
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
