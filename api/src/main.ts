import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(compression());
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
    ],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  // validate pipe
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: error.constraints
            ? error.constraints[Object.keys(error.constraints)[0]]
            : 'Validation failed',
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
      stopAtFirstError: false,
    }),
  );

  await app.listen(4000);
}
bootstrap();
