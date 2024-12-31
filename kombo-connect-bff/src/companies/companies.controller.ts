import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly companiesService: CompaniesService,
  ) {}

  @Get()
  getAllCompanies() {
    return this.companiesService.getAllCompanies();
  }

  @Post('integration')
  async createIntegration(
    @Body() body: { email: string; companyName: string },
  ) {
    const { email, companyName } = body;

    if (!email || !companyName) {
      throw new HttpException(
        'Les champs email et companyName sont obligatoires',
        HttpStatus.BAD_REQUEST,
      );
    }

    const link = await this.integrationService.createIntegrationLink(
      email,
      companyName,
    );
    return { link };
  }
}