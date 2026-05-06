import { Inject, Injectable, Logger } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import type { Transporter } from 'nodemailer';
import { EMAIL_MODULE_OPTIONS, EMAIL_TRANSPORTER } from './email.constants';
import type { EmailModuleOptions, SendMailOptions } from './email.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(EMAIL_TRANSPORTER)
    private readonly transporter: Transporter,
    @Inject(EMAIL_MODULE_OPTIONS)
    private readonly options: EmailModuleOptions,
  ) {}

  async sendMail(mailOptions: SendMailOptions): Promise<void> {
    const { to, subject, templatePath, context } = mailOptions;

    try {
      const templateSource = await readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateSource);
      const html = template(context);

      await this.transporter.sendMail({
        from: this.options.from,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
