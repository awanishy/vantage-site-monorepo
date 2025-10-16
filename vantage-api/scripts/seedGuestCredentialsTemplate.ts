import { createGuestCredentialsTemplate } from "@/config/email/templates/guest-credentials.template";
import { connectDB } from "@/database/db";

async function seedGuestCredentialsTemplate() {
  try {
    console.log("Starting guest credentials template seeding...");
    
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Create the template
    const template = await createGuestCredentialsTemplate();
    console.log("Guest credentials template seeded successfully:", template._id);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding guest credentials template:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedGuestCredentialsTemplate();
