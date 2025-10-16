import dotenv from "dotenv";
dotenv.config({ path: `.env` });
import "../module-alias-setup";
import { connectDB } from "@/database/db";
import { User } from "@/users/user.model";

async function run() {
  await connectDB();
  // Normalize roles and types; ensure required fields
  const res = await User.updateMany(
    {},
    {
      $set: {
        userType: "STUDENT",
      },
    }
  );
  // Ensure role is one of allowed; default STUDENT when missing/invalid
  const users = await User.find({}).select({ role: 1 }).lean();
  for (const u of users) {
    const allowed = new Set(["STUDENT", "ADMIN", "SUPER_ADMIN", "GUEST"]);
    const role = (u as any).role;
    if (!allowed.has(role)) {
      await User.updateOne(
        { _id: (u as any)._id },
        { $set: { role: "STUDENT" } }
      );
    }
  }
  console.log("Migration complete.");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
