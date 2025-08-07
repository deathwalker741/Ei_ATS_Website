// AWS SES email service - equivalent to PHP clsduketip->SendAWSEmail
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Send email via AWS SES
 * Equivalent to PHP clsduketip->SendAWSEmail method
 */
export async function sendAWSEmail(
  to: string,
  from: string,
  subject: string,
  htmlMessage: string,
  ccArray: string[] = [],
  bccArray: string[] = []
): Promise<{ MessageId?: string; error?: string }> {
  try {
    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: [to],
        CcAddresses: ccArray,
        BccAddresses: bccArray,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlMessage,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const result = await sesClient.send(command);
    
    return { MessageId: result.MessageId };
  } catch (error) {
    console.error('AWS SES Error:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}