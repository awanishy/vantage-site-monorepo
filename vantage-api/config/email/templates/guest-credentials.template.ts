import { EmailTemplate } from "./emailTemplates.model";

export const createGuestCredentialsTemplate = async () => {
  try {
    // Check if template already exists
    const existingTemplate = await EmailTemplate.findOne({
      templateType: "guest_credentials",
    });

    if (existingTemplate) {
      console.log("Guest credentials template already exists");
      return existingTemplate;
    }

    // Create the guest credentials email template
    const template = await EmailTemplate.create({
      templateType: "guest_credentials",
      name: "Guest User Credentials",
      description: "Email template for sending guest user account credentials",
      providerName: "default", // This will use the default email provider
      isActive: true,
      from: "noreply@vantageinstitute.com",
      replyTo: "support@vantageinstitute.com",
      htmlContent: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Vantage Institute</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .welcome-title {
            color: #e74c3c;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .credentials-box {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .credential-item {
            margin: 10px 0;
            font-size: 16px;
        }
        .credential-label {
            font-weight: bold;
            color: #495057;
            display: inline-block;
            width: 100px;
        }
        .credential-value {
            font-family: 'Courier New', monospace;
            background-color: #ffffff;
            padding: 5px 10px;
            border-radius: 4px;
            border: 1px solid #dee2e6;
            color: #e74c3c;
            font-weight: bold;
        }
        .login-button {
            display: inline-block;
            background-color: #e74c3c;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .login-button:hover {
            background-color: #c0392b;
        }
        .info-section {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Vantage Institute</div>
            <h1 class="welcome-title">Welcome to Vantage Institute!</h1>
        </div>

        <p>Hello <strong><%= name %></strong>,</p>

        <p>Thank you for your interest in our programs! We've created a guest account for you to complete your purchase. Here are your account credentials:</p>

        <div class="credentials-box">
            <h3 style="margin-top: 0; color: #2c3e50;">Your Account Credentials</h3>
            <div class="credential-item">
                <span class="credential-label">Email:</span>
                <span class="credential-value"><%= email %></span>
            </div>
            <div class="credential-item">
                <span class="credential-label">Password:</span>
                <span class="credential-value"><%= password %></span>
            </div>
        </div>

        <div class="info-section">
            <h3 style="margin-top: 0; color: #2c3e50;">What's Next?</h3>
            <ul>
                <li>Use these credentials to log in to your account</li>
                <li>Complete your program purchase</li>
                <li>Access your course materials and resources</li>
                <li>Update your profile and change your password</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="<%= loginUrl %>" class="login-button">Login to Your Account</a>
        </div>

        <div class="security-note">
            <strong>Security Note:</strong> Please change your password after your first login for security purposes. Keep your credentials safe and don't share them with anyone.
        </div>

        <div class="footer">
            <p>If you have any questions or need assistance, please contact our support team.</p>
            <p>Best regards,<br>The Vantage Institute Team</p>
            <p style="font-size: 12px; color: #999;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
      `,
      variables: [
        {
          variable: "name",
          validationRegex: "^[a-zA-Z\\s]{2,50}$",
        },
        {
          variable: "email",
          validationRegex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        },
        {
          variable: "password",
          validationRegex: "^[a-zA-Z0-9]{8,20}$",
        },
        {
          variable: "loginUrl",
          validationRegex: "^https?://[^\\s]+$",
        },
      ],
      defaultData: {
        loginUrl: "https://vantageinstitute.com/login",
      },
    });

    console.log("Guest credentials template created successfully");
    return template;
  } catch (error) {
    console.error("Error creating guest credentials template:", error);
    throw error;
  }
};
