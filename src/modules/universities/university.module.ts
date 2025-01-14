import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity';
import { University } from './entities/university.entity';
import { WebPage } from './entities/web-page.entity';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';

@Module({
  imports: [TypeOrmModule.forFeature([University, Domain, WebPage])],
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
