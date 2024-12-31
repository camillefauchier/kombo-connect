import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class IntegrationService {
  private KOMBO_API_URL = 'https://api.kombo.dev/v1/connect/create-link';
  private KOMBO_API_KEY = process.env.KOMBO_API_KEY;
  private KOMBO_WEBHOOK_SECRET = process.env.KOMBO_WEBHOOK_SECRET;

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  verifyWebhookSignature(payload: any, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', this.KOMBO_WEBHOOK_SECRET);
    hmac.update(JSON.stringify(payload));
    const expectedSignature = hmac.digest('hex');
    return expectedSignature === signature;
  }

  async saveIntegration(
    integrationId: string,
    companyName: string,
  ): Promise<void> {
    const company = this.companyRepository.create({
      companyName,
      integrationId,
    });
    await this.companyRepository.save(company);
  }

  async createIntegrationLink(
    email: string,
    companyName: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        this.KOMBO_API_URL,
        {
          end_user_email: email,
          end_user_organization_name: companyName,
          integration_category: 'HRIS',
          language: 'fr',
          scope_config_id: 'CxqXBzHADd3qS1NQ9b89ktux',
          enable_filtering: false,
          enable_field_mapping: false,
          link_type: 'EMBEDDED',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.KOMBO_API_KEY}`,
          },
        },
      );

      // Retourne le lien d'intégration fourni par Kombo
      return response.data.data.link;
    } catch (error) {
      console.error(
        'Erreur lors de la création du lien d’intégration :',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Erreur lors de la création du lien d’intégration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
