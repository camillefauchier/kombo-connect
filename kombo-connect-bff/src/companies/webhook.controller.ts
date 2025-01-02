import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { createHmac } from 'node:crypto';
import { Request } from 'express';

@Controller('webhooks')
export class WebhookController {
  private KOMBO_WEBHOOK_SECRET = process.env.KOMBO_WEBHOOK_SECRET;
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('integration-completed')
  async handleIntegrationCompleted(
    @Body() body: any,
    @Headers('x-kombo-signature') signature: string,
    @Req() request: Request, // Access the raw request object
  ) {
    console.log({ signature });
    console.log({ body });

    const bodyString = JSON.stringify(body, null, 2);
    const isValid = this.verifyWebhookSignature(bodyString, signature);
    console.log({ isValid });

    if (!isValid) {
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
      console.log({ companyName, integrationId });

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

  private verifyWebhookSignature(body: string, signature: string): boolean {
    const hmac = createHmac('sha256', this.KOMBO_WEBHOOK_SECRET);
    hmac.update(body, 'utf8');
    const expectedSignature = hmac.digest('base64url');
    return expectedSignature === signature;
  }
}
