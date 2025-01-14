import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { MessageResponse } from '../../types';
import { UniversityService } from './university.service';
import { Response } from 'express';

@Controller('universities')
export class UniversityController {
  constructor(private readonly etlService: UniversityService) {}

  @HttpCode(HttpStatus.OK)
  @Get('fetch-data')
  async fetchData(): Promise<MessageResponse> {
    return this.etlService.fetchData();
  }

  @HttpCode(HttpStatus.OK)
  @Get('csv')
  async transformData(@Res() res: Response): Promise<void> {
    const csvString = await this.etlService.transformData();
    const filename: string = `university_data_${Date.now()}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send(csvString);
  }
}
