import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailData {
  username?: string;
  validationLink?: string;
  otp?: string;
}
@Injectable()
export class NotificationService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_EMAIL'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  private generateEmailTemplate(type: 'validation' | 'otp', data: EmailData) {
    const isValidation = type === 'validation';
    const content = isValidation
      ? `Click the button below to verify your account and access your workspace.`
      : `Use the code below to reset your password. This code will expire in 10 minutes.`;

    const actionLabel = isValidation ? 'Verify Email' : data.otp;
    const actionLink = isValidation ? data.validationLink : '#';

    const title = isValidation ? 'Verify your identity' : 'Reset your password';
    const username = data.username || 'User';
    const actionHtml = isValidation
      ? `<a href="${actionLink}" class="button">${actionLabel}</a>`
      : `<div class="otp">${actionLabel}</div>`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; border: 1px solid #f3f4f6; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { padding: 32px; background: #000; text-align: center; }
          .content { padding: 40px; text-align: center; }
          .title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 16px; letter-spacing: -0.025em; }
          .text { font-size: 16px; color: #6b7280; line-height: 24px; margin-bottom: 32px; }
          .button { display: inline-block; padding: 14px 32px; background-color: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; transition: background 0.2s; }
          .otp { display: inline-block; padding: 16px 32px; background-color: #f3f4f6; color: #000; font-family: monospace; font-size: 32px; font-weight: 800; border-radius: 8px; letter-spacing: 4px; border: 1px solid #e5e7eb; }
          .footer { padding: 24px; background: #f9fafb; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="color: white; font-weight: 900; font-size: 20px;">WORKSPACE</div>
          </div>
          <div class="content">
            <h1 class="title">${title}</h1>
            <p class="text">Hi ${username},<br>${content}</p>
            ${actionHtml}
          </div>
          <div class="footer">
            &copy; 2026 Workspace Inc. All rights reserved.<br>
            Sent via Notification Microservice
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendEmail(email: string, type: 'validation' | 'otp', data: any) {
    const subject =
      type === 'validation'
        ? 'Verify your Workspace account'
        : 'Your Security Code';
    const html = this.generateEmailTemplate(type, data);
    const fromAddress = this.configService.get<string>('SMTP_FROM');

    try {
      await this.transporter.sendMail({
        from: `Workspace <${fromAddress}>`,
        to: email,
        subject: subject,
        html: html,
      });

      console.log(`\n========================================`);
      console.log(`✅ [EMAIL SENT SUCCESSFULLY]`);
      console.log(`📬 To:      ${email}`);
      console.log(`📝 Subject: ${subject}`);
      console.log(`========================================\n`);
    } catch (error) {
      console.error(`\n❌ [EMAIL SENDING FAILED]`);
      console.error(`📬 To:      ${email}`);
      console.error(
        `📝 Error:    ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      console.error(`========================================\n`);
    }
  }
}
