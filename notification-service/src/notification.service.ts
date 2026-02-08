import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  sendEmail(email: string, subject: string, body: string) {
    console.log(`[EMAIL SENT] To: ${email} | Subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}
