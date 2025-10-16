import mongoose, { Schema } from "mongoose";

interface TemplateVariable {
  variable: string;
  validationRegex?: string;
}

interface EmailTemplateDoc {
  templateType: string;
  name: string;
  description?: string | null;
  providerName: string;
  isActive: boolean;
  from?: string;
  replyTo?: string;
  htmlContent: string;
  variables: TemplateVariable[];
  defaultData?: unknown;
  lastUpdated?: Date;
}

const VariableSchema = new Schema(
  {
    variable: {
      type: String,
      required: true,
    },
    validationRegex: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const EmailTemplateSchema = new Schema(
  {
    templateType: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: { type: String, default: null },
    providerName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    from: {
      type: String,
      required: false,
    },
    replyTo: String,
    htmlContent: {
      type: String,
      required: true,
    },
    variables: [VariableSchema],
    defaultData: Schema.Types.Mixed,
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const EmailTemplate = mongoose.model(
  "EmailTemplate",
  EmailTemplateSchema
);
