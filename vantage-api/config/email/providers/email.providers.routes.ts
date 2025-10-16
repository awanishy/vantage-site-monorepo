// email.providers.routes.ts
import express from "express";
import { GmailProvider } from "@/config/email/providers/email.providers.config";
import { EmailService } from "../nodemailer/nodemailer.config";
import EmailProvider from "@/config/email/providers/email.providers.model";

const router = express.Router();

router.get("/auth/gmail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Find the Gmail provider for this email in the database
    const provider = await EmailProvider.findOne({
      "auth.user": email,
      type: "gmail",
      isActive: true,
    });

    if (!provider) {
      res.status(404).send("Gmail provider not configured for this email");
      return;
    }

    const emailService = EmailService.getInstance();

    const gmailProvider = Array.from(emailService["providers"].values()).find(
      (provider) => provider instanceof GmailProvider
    );

    console.log("Gmail Provider found:", !!gmailProvider);

    if (!gmailProvider) {
      res.status(500).send("Gmail provider not configured");
      return;
    }

    const gmailProviderInstance = gmailProvider as GmailProvider;

    // Get the authorization URL for initial token retrieval
    const authUrl = gmailProviderInstance.getAuthUrl();

    res.redirect(authUrl);
  } catch (error) {}
});

router.get("/gmail-callback/:email", async (req, res): Promise<void> => {
  try {
    const { email } = req.params;
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      res.status(400).send("No code provided");
      return;
    }

    // Check if provider exists in database for this email
    const providerExists = await EmailProvider.findOne({
      "auth.user": email,
      type: "gmail",
    });

    if (!providerExists) {
      res.status(404).send("No Gmail provider configured for this email");
      return;
    }

    const emailService = EmailService.getInstance();
    const gmailProvider = Array.from(emailService["providers"].values()).find(
      (provider) =>
        provider instanceof GmailProvider &&
        (provider as GmailProvider).config.auth.user === email
    );

    if (!gmailProvider) {
      res.status(500).send("Gmail provider not initialized for this email");
      return;
    }

    const gmailProviderInstance = gmailProvider as GmailProvider;

    await gmailProviderInstance.handleCallback(code);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isConnected = await gmailProviderInstance.verifyConnection();
    if (isConnected) {
      res.send("Gmail authentication successful! You can close this window.");
    } else {
      res.status(500).send("Failed to verify Gmail connection");
    }
  } catch (error) {
    console.error("Gmail callback error:", error);
    res.status(500).send("Authentication failed");
  }
});

export default router;
