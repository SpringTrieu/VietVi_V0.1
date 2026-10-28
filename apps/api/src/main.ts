import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './config/env';

async function bootstrap() {
  const env = validateEnv();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  await app.listen(env.PORT);
  console.log(`🚀 VIETVI API is running on: http://localhost:${env.PORT}/api/v1`);
  console.log(`🏥 Health check at: http://localhost:${env.PORT}/api/v1/health`);
}
bootstrap();
