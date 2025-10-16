import { APIError } from "@/utils/APIError";
import { IEmailTemplate } from "@/types/emailTemplates.types";
import {
  validationService,
  ValidationRule,
} from "@/middlewares/variableValidation";
import { EmailTemplate } from "@/config/email/templates/emailTemplates.model";
import { EmailService } from "@/config/email/nodemailer/nodemailer.config";
import { User } from "@users/user.model";
import ejs from "ejs";

interface SendTemplateEmailOptions {
  templateId?: string;
  templateType?: string;
  userId?: string;
  to: string | string[];
  subject: string;
  data?: Record<string, any>;
}

export class EmailTemplateService {
  private static instance: EmailTemplateService;

  private constructor() {}

  public static getInstance(): EmailTemplateService {
    if (!EmailTemplateService.instance) {
      EmailTemplateService.instance = new EmailTemplateService();
    }
    return EmailTemplateService.instance;
  }

  private async renderTemplate(
    template: IEmailTemplate,
    data: any
  ): Promise<string> {
    if (!template.htmlContent) {
      throw APIError.BadRequest("Template HTML content is missing");
    }

    // First, ensure all template variables have at least an empty string
    const mergedData: Record<string, any> = {};

    // Initialize all template variables with empty strings
    for (const varDef of template.variables) {
      mergedData[varDef.variable] = "";
    }

    // Apply default values where they exist
    if (template.defaultData) {
      Object.assign(mergedData, template.defaultData);
    }

    // Validate variables with regex and use defaults for failed validations
    for (const varDef of template.variables) {
      // If the variable exists in the provided data
      if (data[varDef.variable] !== undefined) {
        // Check if validation is required and the variable has a validation regex
        if (varDef.validationRegex) {
          const validationResult = validationService.validateData(
            data[varDef.variable],
            `regex:${varDef.validationRegex}` as ValidationRule
          );

          if (validationResult.isValid) {
            // If validation passes, use the provided value
            mergedData[varDef.variable] = data[varDef.variable];
          } else {
            // If validation fails, log the issue but keep the default value
            // If no default value exists, the empty string will remain
            console.warn(
              `Validation failed for variable '${varDef.variable}': ${validationResult.error}. Using default value or empty string.`
            );
          }
        } else {
          // No validation required, use the provided value
          mergedData[varDef.variable] = data[varDef.variable];
        }
      }
      // If variable doesn't exist in data, we already have default or empty string
    }

    // Add any remaining data fields that aren't defined in variables
    // This ensures we don't lose any extra data that might be needed
    for (const key in data) {
      if (!template.variables.some((v) => v.variable === key)) {
        mergedData[key] = data[key];
      }
    }

    try {
      const result = ejs.render(template.htmlContent, mergedData, {
        // EJS options
        rmWhitespace: false,
        strict: false,
        async: false,
      });

      return result;
    } catch (error) {
      console.error("Template rendering error:", {
        error,
        template: template.htmlContent,
        data: mergedData,
      });
      throw error;
    }
  }

  private async getTemplate(options: {
    templateId?: string;
    templateType?: string;
  }): Promise<IEmailTemplate> {
    let template: IEmailTemplate | null;

    if (options.templateId) {
      template = await EmailTemplate.findById(options.templateId).exec();
      if (!template) {
        throw APIError.NotFound("Template not found");
      }
    } else if (options.templateType) {
      template = await EmailTemplate.findOne({
        templateType: options.templateType,
        isActive: true,
      })
        .sort({ priority: -1 })
        .exec();

      if (!template) {
        throw APIError.NotFound(
          `No active template found for type: ${options.templateType}`
        );
      }
    } else {
      throw APIError.BadRequest(
        "Either templateId or templateType must be provided"
      );
    }

    return template;
  }

  private async processTemplateData(
    template: IEmailTemplate,
    userId: string | undefined,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    let processedData = { ...data };

    const hasOtpVariable = template.variables.some((v) => v.variable === "otp");

    if (hasOtpVariable && userId) {
      const user = await User.findById(userId);
      if (!user) {
        throw APIError.NotFound("User not found");
      }
      const otp = await user.createOTP("email");

      processedData = {
        ...processedData,
        otp,
      };
    }

    return processedData;
  }

  public static async sendTemplatedEmail(
    options: SendTemplateEmailOptions
  ): Promise<any> {
    const service = EmailTemplateService.getInstance();

    try {
      // Get template
      const template = await service.getTemplate({
        templateId: options.templateId,
        templateType: options.templateType,
      });

      // Process template data
      const processedData = await service.processTemplateData(
        template,
        options.userId,
        options.data || {}
      );

      // Render template
      const html = await service.renderTemplate(template, processedData);

      // Send email
      const emailService = EmailService.getInstance();
      const result = await emailService.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
        provider: template.providerName,
      });

      //console.log("Email sent successfully: ", result);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error: any) {
      throw APIError.InternalError(
        error.message || "Failed to send templated email",
        error.code
      );
    }
  }

  public static async listActiveTemplateTypes(): Promise<string[]> {
    const docs = await EmailTemplate.find({ isActive: true })
      .select("templateType")
      .lean();
    return Array.from(new Set(docs.map((d: any) => d.templateType))).sort();
  }

  public static async validateRequiredTemplates(
    requiredTypes: string[]
  ): Promise<{ missing: string[]; available: string[] }> {
    const available = await EmailTemplateService.listActiveTemplateTypes();
    const availableSet = new Set(available);
    const missing = requiredTypes.filter((t) => !availableSet.has(t));
    return { missing, available };
  }
}
