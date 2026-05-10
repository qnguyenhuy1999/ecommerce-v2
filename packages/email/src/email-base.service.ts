import { readFile } from 'node:fs/promises'
import Handlebars from 'handlebars'
import type { Transporter } from 'nodemailer'
import type { EmailModuleOptions, SendMailOptions } from './email.types'

export class EmailServiceBase {
  constructor(
    protected readonly transporter: Transporter,
    protected readonly options: EmailModuleOptions,
    protected readonly logger: {
      log: (msg: string) => void
      error: (msg: string, stack?: string) => void
    },
  ) {}

  async sendMail(mailOptions: SendMailOptions): Promise<void> {
    const { to, subject, templatePath, context } = mailOptions

    try {
      const templateSource = await readFile(templatePath, 'utf-8')
      const template = Handlebars.compile(templateSource)
      const html = template(context)

      await this.transporter.sendMail({
        from: this.options.from,
        to,
        subject,
        html,
      })

      this.logger.log(`Email sent to ${to}: ${subject}`)
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`,
        (error as Error).stack,
      )
      throw error
    }
  }
}
