type Env = {
  NODE_ENV: string;
  PORT: number;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  MONGODB_URI: string;
  CF_BASE_URL: string;
  CF_API_VERSION: string;
  CF_CLIENT_ID: string;
  CF_CLIENT_SECRET: string;
  CF_VERIFY_WEBHOOK: boolean;
};

const REQUIRED_VARS = [
  "MONGODB_URI",
  "FRONTEND_URL",
  "CF_CLIENT_ID",
  "CF_CLIENT_SECRET",
];

function mustGet(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback ?? "";
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

function asBoolean(val: string | undefined, def: boolean): boolean {
  if (val === undefined) return def;
  return ["1", "true", "yes", "on"].includes(String(val).toLowerCase());
}

export function getEnv(): Env {
  // quick required check to fail-fast with clear message
  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = Number(process.env.PORT || 5000);
  if (Number.isNaN(PORT)) throw new Error("PORT must be a number");

  const FRONTEND_URL = mustGet("FRONTEND_URL");
  const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  const MONGODB_URI = mustGet("MONGODB_URI");

  const CF_BASE_URL =
    process.env.CF_BASE_URL || "https://sandbox.cashfree.com/pg";
  const CF_API_VERSION = process.env.CF_API_VERSION || "2025-01-01";
  const CF_CLIENT_ID = mustGet("CF_CLIENT_ID");
  const CF_CLIENT_SECRET = mustGet("CF_CLIENT_SECRET");
  const CF_VERIFY_WEBHOOK = asBoolean(process.env.CF_VERIFY_WEBHOOK, false);

  return {
    NODE_ENV,
    PORT,
    BACKEND_URL,
    FRONTEND_URL,
    MONGODB_URI,
    CF_BASE_URL,
    CF_API_VERSION,
    CF_CLIENT_ID,
    CF_CLIENT_SECRET,
    CF_VERIFY_WEBHOOK,
  };
}
