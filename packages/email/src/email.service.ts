import { Inject, Injectable, Logger } from '@nestjs/common';
import { EMAIL_MODULE_OPTIONS, EMAIL_TRANSPORTER } from './email.constants';
import type { EmailModuleOptions } from './email.types';
import { EmailServiceBase } from './email-base.service';

@Injectable()
export class EmailService extends EmailServiceBase {
  constructor(
    @Inject(EMAIL_TRANSPORTER)
    transporter: any,
    @Inject(EMAIL_MODULE_OPTIONS)
    options: EmailModuleOptions,
  ) {
    super(transporter, options, new Logger(EmailService.name));
  }
}
