import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { Injectable } from '@nestjs/common';

interface EmailData<T> {
  to: string;
  subject: string;
  template: string;
  data: Partial<T>;
}

@Injectable()
class EmailManagerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),

      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail<T>({
    to,
    subject,
    template,
    data,
  }: EmailData<T>): Promise<void> {
    const html = await this.renderTemplate<T>(template, data);
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  }

  private async renderTemplate<T>(
    template: string,
    data: EmailData<T>['data'],
  ): Promise<string> {
    const templateDir = `src/core/templates/email/${template}.ejs`;

    return new Promise<string>((resolve, reject) => {
      ejs.renderFile(templateDir, data, (err, str) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(str);
        }
      });
    });
  }
}

export default EmailManagerService;
