import { EmailTemplate } from "@/config/email/templates/emailTemplates.model";

type TemplateSeed = {
  templateType: string;
  name: string;
  description?: string;
  providerName: string;
  variables: { variable: string; validationRegex?: string }[];
  htmlContent: string;
  defaultData?: Record<string, any>;
};

const baseStyles = `
  <style>
    body { margin:0; padding:0; background:#f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
    .container { max-width: 520px; margin: 0 auto; padding: 24px 16px; }
    .card { background:#ffffff; border-radius:12px; padding:24px; box-shadow: 0 1px 2px rgba(16,24,40,0.05); }
    .h1 { font-size:20px; font-weight:700; color:#111827; margin:0 0 12px; }
    .p { font-size:14px; line-height:1.6; color:#374151; margin:0 0 16px; }
    .muted { color:#6b7280; }
    .btn { display:inline-block; background:#2563eb; color:#fff !important; text-decoration:none; padding:12px 16px; border-radius:8px; font-weight:600; }
    .code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background:#f3f4f6; padding:8px 12px; border-radius:8px; display:inline-block; letter-spacing:2px; font-weight:700; }
    .hr { height:1px; background:#e5e7eb; border:0; margin:20px 0; }
    .footer { font-size:12px; color:#6b7280; text-align:center; margin-top:16px; }
    @media (max-width: 480px) {
      .card { padding:20px; }
      .h1 { font-size:18px; }
      .p { font-size:14px; }
    }
  </style>
`;

const wrap = (inner: string) => `
  <!DOCTYPE html>
  <html><head><meta name="viewport" content="width=device-width, initial-scale=1"/>${baseStyles}</head>
  <body>
    <div class="container">
      <div class="card">
        ${inner}
        <div class="footer">© <%= year %> Vantage Institute</div>
      </div>
    </div>
  </body></html>
`;

const templates: TemplateSeed[] = [
  {
    templateType: "signup-welcome",
    name: "Welcome (Signup)",
    description: "Welcome email after user signup",
    providerName: "nodemailer",
    variables: [{ variable: "name" }],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Welcome to Vantage, <%= name %>!</h1>
      <p class="p">Your account was created successfully. We're excited to have you on board.</p>
      <p class="p muted">If you didn't initiate this, you can safely ignore this email.</p>
      <hr class="hr" />
    `),
  },
  {
    templateType: "email-verify",
    name: "Verify Email",
    description: "Email verification with OTP",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "otp", validationRegex: "^\\d{6}$" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Verify your email</h1>
      <p class="p">Hi <%= name %>, use this one-time code to verify your email:</p>
      <div class="code"><%= otp %></div>
      <p class="p muted">The code expires in 5 minutes.</p>
    `),
  },
  {
    templateType: "password-reset",
    name: "Password Reset",
    description: "Password reset with OTP",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "otp", validationRegex: "^\\d{6}$" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Reset your password</h1>
      <p class="p">Hi <%= name %>, use this code to reset your password:</p>
      <div class="code"><%= otp %></div>
      <p class="p muted">If you did not request this, you can ignore this email.</p>
    `),
  },
  {
    templateType: "guest-welcome",
    name: "Guest Account Details",
    description: "Credentials for guest checkout",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "email" },
      { variable: "password" },
      { variable: "orderId" },
      { variable: "amount" },
      { variable: "currency" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Your guest account is ready</h1>
      <p class="p">Hi <%= name %>, we created a guest account so you can manage your order.</p>
      <p class="p"><strong>Login:</strong> <%= email %><br/><strong>Temporary password:</strong> <%= password %></p>
      <p class="p">Order <strong>#<%= orderId %></strong> — <strong><%= currency %> <%= amount %></strong></p>
    `),
  },
  {
    templateType: "guest_credentials",
    name: "Guest Credentials",
    description: "Login credentials for guest users",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "email" },
      { variable: "password" },
      { variable: "loginUrl" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Your Vantage Institute Account Credentials</h1>
      <p class="p">Hi <%= name %>, we've created a guest account for you to complete your purchase.</p>
      <p class="p"><strong>Email:</strong> <%= email %><br/><strong>Password:</strong> <span class="code"><%= password %></span></p>
      <p class="p">You can use these credentials to log in and manage your account:</p>
      <a href="<%= loginUrl %>" class="btn">Login to Your Account</a>
      <p class="p muted">If you didn't create this account, you can safely ignore this email.</p>
    `),
  },
  {
    templateType: "order-created",
    name: "Order Created",
    description: "Order confirmation",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "orderId" },
      { variable: "amount" },
      { variable: "currency" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">We've created your order</h1>
      <p class="p">Hi <%= name %>, your order <strong>#<%= orderId %></strong> was created successfully.</p>
      <p class="p">Total: <strong><%= currency %> <%= amount %></strong></p>
    `),
  },
  {
    templateType: "password-reset-success",
    name: "Password Reset Successful",
    description: "Confirmation after password reset",
    providerName: "nodemailer",
    variables: [{ variable: "name" }, { variable: "email" }],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Your password was reset</h1>
      <p class="p">Hi <%= name %>, your password for <%= email %> was changed successfully.</p>
    `),
  },
  {
    templateType: "payment-success",
    name: "Payment Success",
    description: "Sent when payment succeeds",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "orderId" },
      { variable: "amount" },
      { variable: "currency" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Payment successful</h1>
      <p class="p">Hi <%= name %>, your payment for order <strong>#<%= orderId %></strong> was successful.</p>
      <p class="p">Total paid: <strong><%= currency %> <%= amount %></strong></p>
    `),
  },
  {
    templateType: "payment-failed",
    name: "Payment Failed",
    description: "Sent when payment fails",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "orderId" },
      { variable: "amount" },
      { variable: "currency" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Payment failed</h1>
      <p class="p">Hi <%= name %>, your payment attempt for order <strong>#<%= orderId %></strong> didn’t complete.</p>
      <p class="p">Amount: <strong><%= currency %> <%= amount %></strong></p>
    `),
  },
  {
    templateType: "account-status-change",
    name: "Account Status Change",
    description: "Notify user when account is activated/deactivated",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "email" },
      { variable: "status" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Your account status changed</h1>
      <p class="p">Hi <%= name %>, your account for <%= email %> is now <strong><%= status %></strong>.</p>
    `),
  },
  {
    templateType: "role-change",
    name: "Role Updated",
    description: "Notify user when role/userType changes",
    providerName: "nodemailer",
    variables: [
      { variable: "name" },
      { variable: "email" },
      { variable: "oldRole" },
      { variable: "newRole" },
      { variable: "oldUserType" },
      { variable: "newUserType" },
    ],
    defaultData: { year: new Date().getFullYear() },
    htmlContent: wrap(`
      <h1 class="h1">Your role was updated</h1>
      <p class="p">Hi <%= name %>, your role changed from <strong><%= oldRole %></strong> to <strong><%= newRole %></strong>.</p>
      <p class="p">User type: <strong><%= oldUserType %></strong> → <strong><%= newUserType %></strong></p>
    `),
  },
];

export async function seedEmailTemplates(): Promise<void> {
  for (const t of templates) {
    await EmailTemplate.findOneAndUpdate(
      { templateType: t.templateType },
      {
        $set: {
          name: t.name,
          description: t.description || null,
          providerName: t.providerName,
          isActive: true,
          htmlContent: t.htmlContent,
          variables: t.variables,
          defaultData: t.defaultData || {},
          lastUpdated: new Date(),
        },
      },
      { upsert: true, new: true }
    ).exec();
  }
}
