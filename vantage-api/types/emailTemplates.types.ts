import { Document, Types } from "mongoose";

// Add the template variable interface
export interface TemplateVariable {
  variable: string;
  validationRegex?: string | null;
}

export interface IEmailTemplate {
  templateType: string;
  name: string;
  description?: string | null;
  providerName: string;
  isActive: boolean;
  from?: string | null;
  replyTo?: string | null;
  htmlContent: string;
  variables: TemplateVariable[];
  defaultData?: Record<string, any> | null;
  lastUpdated?: Date;
}

export interface IEmailTemplateDocument
  extends Document,
    Omit<IEmailTemplate, "_id"> {
  _id: Types.ObjectId;
}
