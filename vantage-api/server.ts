// import "module-alias/register";
import dotenv from "dotenv";
const envType = process.env.NODE_ENV || "local";
dotenv.config({ path: `.env` });
import { getEnv } from "./config/env";
import "./module-alias-setup";

import express from "express";
import paymentsRoutes from "@/payments/routes/payments.routes";
// import mongoose from 'mongoose';
import cors from "cors";

// Determine the environment

// Load the appropriate .env file
// dotenv.config({ path: `.env.${envType}` });

import { connectDB } from "@/database/db";

// Email functionality temporarily disabled for blog-only system
import { setupEmailProviders } from "@/config/email/nodemailer/nodemailer.config";
import emailProviderRoutes from "@/config/email/providers/email.providers.routes";
import templatedEmailRoutes from "@/config/email/templates/emailTemplates.routes";
import { EmailTemplateService } from "@/config/email/templates/emailTemplates.config";

import { errorHandler } from "@/middlewares/errorHandler";
import { requestId } from "@/middlewares/requestId";
import courseRoutes from "@/courses/courses.routes";
import authRoutes from "@/users/routes/auth.routes";
import { seedFellowshipProgram } from "@/courses/seed";
import { CurrencyService } from "./currency/currency.service";
import currencyRoutes from "@/currency/currency.routes";
import { seedEmailTemplates } from "@/config/email/templates/seedEmailTemplates";

const envVars = getEnv();

const app = express();
// const PORT = process.env.PORT || 5000;

// Middlewares configuration

// Configure CORS
const corsOptions = {
  origin: [envVars.FRONTEND_URL, envVars.BACKEND_URL], // Your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "isAuthenticated",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // Limit preflight requests cache to 10 minutes
};

// Middleware
app.use(cors(corsOptions));
app.use(requestId);

// Additional security headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

// Raw body for payment webhooks (needed for signature verification)
app.use("/api/payments/webhooks", express.raw({ type: "application/json" }));

// JSON middleware, but skip for raw webhook path
app.use((req, res, next) => {
  if (req.path === "/api/payments/webhooks") return next();
  return (express.json() as any)(req, res, next);
});

// Log the requests
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} ${
      req.method === "PATCH" ? JSON.stringify(req.body) : ""
    }`
  ); // record the parameters also that were sent
  next();
});

// CurrencyFetchService.getInstance();

// Email routes temporarily disabled for blog-only system
app.use("/api/v1/OAuth2Client", emailProviderRoutes);
app.use("/api/email/templatedEmail", templatedEmailRoutes);
app.use("/api/programs", courseRoutes);
app.use("/api/users/auth", authRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/currency", currencyRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

connectDB()
  .then(() => {
    seedFellowshipProgram().catch((e) =>
      console.error("Seed fellowship failed:", e)
    );

    // Email providers temporarily disabled for blog-only system
    (async () => {
      try {
        await setupEmailProviders();
        await seedEmailTemplates();

        // Log active email template types and check required ones
        const requiredTemplates = [
          "signup-welcome",
          "email-verify",
          "password-reset",
          "password-reset-success",
          "guest-welcome",
          "order-created",
          "payment-success",
          "payment-failed",
          "account-status-change",
          "role-change",
          "guest_credentials",
        ];
        try {
          const { available, missing } =
            await EmailTemplateService.validateRequiredTemplates(
              requiredTemplates
            );
          console.log("Email templates available:", available);
          if (missing.length) {
            console.warn("Email templates missing:", missing);
          }
        } catch (e) {
          console.warn("Email template validation failed:", e);
        }
      } catch (error) {
        console.error("Error setting up email providers:", error);
      }
    })();

    CurrencyService.getInstance();
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
      console.log("Environment configuration:");
      console.log(`- Frontend URL: ${envVars.FRONTEND_URL}`);
      console.log("All required environment variables are present and valid.");
    });
  })
  .catch((error) => console.error("Database connection error:", error));
