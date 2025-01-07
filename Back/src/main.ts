import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enabling CORS for all origins (you can replace '*' with a specific domain if needed)
  app.enableCors({
    origin: '*', // Allow all origins, or specify a particular domain like 'http://localhost:3000'
    methods: 'GET, POST, PUT, DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  await app.listen(3001);
}
bootstrap();
