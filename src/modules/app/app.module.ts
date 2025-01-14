import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../../database';
import { UniversityModule } from '../universities/university.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UniversityModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    {
      module: HttpModule,
      global: true,
    },
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
