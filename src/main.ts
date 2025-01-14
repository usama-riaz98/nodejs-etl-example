import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { GlobalExceptionFilter } from './exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server is running ${await app.getUrl()}`);
}
bootstrap();
