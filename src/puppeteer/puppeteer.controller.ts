import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';

@Controller('api')
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Get('partner-data')
  async getPartnerData(@Query('targetUrl') targetUrl: string): Promise<string> {
    if (!targetUrl) {
      throw new BadRequestException('The "targetUrl" query parameter is required.');
    }
    const result = await this.puppeteerService.fetchPartnerData(targetUrl);

    if (result === null) {
    throw new Error('Failed to fetch partner data');
    }

    return result;
  }
}
