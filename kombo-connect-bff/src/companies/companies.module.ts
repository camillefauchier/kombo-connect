import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { IntegrationService } from './integration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompaniesService } from './companies.service';
import {WebhookController} from "./webhook.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController, WebhookController],
  providers: [IntegrationService, CompaniesService],
})
export class CompaniesModule {}
