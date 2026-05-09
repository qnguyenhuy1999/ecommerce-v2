import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter, ResponseInterceptor } from '@ecom/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('admin');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('E-commerce Admin API')
    .setDescription('The admin API for managing the e-commerce platform')
    .setVersion('1.0')
    .addTag('admin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT ?? 4002;
  await app.listen(port);
  console.log(`Admin API running on http://localhost:${port}`);
}

bootstrap();
