import dotenv from "dotenv";
dotenv.config({ path: `.env` });
import "../../../module-alias-setup";
import { connectDB } from "@/database/db";
import { seedEmailTemplates } from "@/config/email/templates/seedEmailTemplates";

async function run() {
  await connectDB();
  await seedEmailTemplates();
  console.log("Email templates seeded");
  process.exit(0);
}

run().catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
