import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './config/env';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('👷 VIETVI Worker context initialized successfully');

  const shutdown = async () => {
    console.log('Worker shutting down...');
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
bootstrap();
