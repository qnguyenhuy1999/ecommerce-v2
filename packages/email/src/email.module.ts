import { DynamicModule, Module } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import { EMAIL_MODULE_OPTIONS, EMAIL_TRANSPORTER } from './email.constants'
import { EmailService } from './email.service'
import type { EmailModuleOptions } from './email.types'

@Module({})
export class EmailModule {
  static forRoot(options: EmailModuleOptions): DynamicModule {
    const transporterProvider = {
      provide: EMAIL_TRANSPORTER,
      useFactory: () => {
        return createTransport({
          host: options.host,
          port: options.port,
          secure: options.secure ?? false,
          auth: {
            user: options.auth.user,
            pass: options.auth.pass,
          },
        })
      },
    }

    const optionsProvider = {
      provide: EMAIL_MODULE_OPTIONS,
      useValue: options,
    }

    return {
      module: EmailModule,
      global: true,
      providers: [transporterProvider, optionsProvider, EmailService],
      exports: [EmailService],
    }
  }
}
