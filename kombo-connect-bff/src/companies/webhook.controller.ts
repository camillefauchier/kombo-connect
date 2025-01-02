import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { createHmac } from 'node:crypto';

@Controller('webhooks')
export class WebhookController {
  private KOMBO_WEBHOOK_SECRET = process.env.KOMBO_WEBHOOK_SECRET;
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('integration-completed')
  async handleIntegrationCompleted(
    @Body() body: any,
    @Headers('x-kombo-signature') signature: string,
  ) {
    // Verify the webhook signature to ensure authenticity
    if (!this.verifyWebhookSignature(body, signature)) {
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

  verifyWebhookSignature(req: any, KOMBO_WEBHOOK_SECRET: string): boolean {
    // Retrieve the signature from headers
    const signatureHeader = req.headers['x-kombo-signature'];

    // Get the raw UTF-8-encoded string body
    const body = req.rawBody || JSON.stringify(req.body, null, 2);

    // Generate the expected signature
    const signature = createHmac('sha256', KOMBO_WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64url');

    // Compare the computed signature with the header's signature
    return signature === signatureHeader;
  }
}
