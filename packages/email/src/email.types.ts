export interface EmailModuleOptions {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  templatePath: string;
  context: Record<string, unknown>;
}
