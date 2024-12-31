import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('integration-completed')
  async handleIntegrationCompleted(
    @Body() body: any,
    @Headers('x-kombo-signature') signature: string,
  ) {
    // Verify the webhook signature to ensure authenticity
    if (!this.integrationService.verifyWebhookSignature(body, signature)) {
      throw new HttpException(
        'Invalid webhook signature',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      // Extract the required fields from the payload
      const integrationId = body.data.id;
      const companyName = body.data.end_user.organization_name;

      // Save the integration data in the database
      await this.integrationService.saveIntegration(integrationId, companyName);

      return { status: 'success' };
    } catch (error) {
      console.error('Error processing integration webhook:', error);
      throw new HttpException(
        'Error processing the integration webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
