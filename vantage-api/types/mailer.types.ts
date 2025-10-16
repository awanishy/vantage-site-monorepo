// src/services/email/mailer-types.ts

export type ProviderType = 'smtp' | 'gmail' | 'outlook' | 'sendgrid' | 'mailgun' | 'ses' | 'custom';
export type AuthType = 'smtp' | 'oauth2' | 'api' | 'certificate' | 'xoauth2' | 'custom';

export interface BaseProviderConfig {
  type: ProviderType;
  from?: string;
  replyTo?: string;
  name?: string;
  isDefault?: boolean;
}

export interface BaseAuthConfig {
  type: AuthType;
  user?: string;
}

// Auth configurations for different methods
export interface SMTPAuthConfig extends BaseAuthConfig {
  type: 'smtp';
  user: string;
  pass: string;
}

export interface OAuth2AuthConfig extends BaseAuthConfig {
  type: 'oauth2';
  user: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  callbackUrl: string;
  accessToken?: string;
  scope?: string;
  tokenType?: string;
  expiryDate?: number;
  refreshToken?: string;
}


export interface APIAuthConfig extends BaseAuthConfig {
  type: 'api';
  apiKey: string;
  apiSecret?: string;
  domain?: string;
}

export interface CertificateAuthConfig extends BaseAuthConfig {
  type: 'certificate';
  cert: string;
  key: string;
  passphrase?: string;
}

export type AuthConfig = SMTPAuthConfig | OAuth2AuthConfig | APIAuthConfig | CertificateAuthConfig;

// Provider-specific configurations
export interface SMTPConfig extends BaseProviderConfig {
  type: 'smtp';
  host: string;
  port: number;
  secure: boolean;
  auth: SMTPAuthConfig;
}

export interface GmailConfig extends BaseProviderConfig {
  type: 'gmail';
  auth: OAuth2AuthConfig;
}

export interface SendGridConfig extends BaseProviderConfig {
  type: 'sendgrid';
  auth: APIAuthConfig;
}

export interface MailgunConfig extends BaseProviderConfig {
  type: 'mailgun';
  auth: APIAuthConfig;
  domain: string;
}

export type ProviderConfig = SMTPConfig | GmailConfig | SendGridConfig | MailgunConfig;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType?: string;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  from?: string;
  provider?: string;
}
