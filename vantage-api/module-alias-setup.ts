import moduleAlias from "module-alias";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const rootDir = __dirname;

// Register the aliases
moduleAlias.addAliases({
  "@": path.join(rootDir),
  "@config": path.join(rootDir, "config"),
  "@database": path.join(rootDir, "database"),
  "@middlewares": path.join(rootDir, "middlewares"),
  "@miscellaneous": path.join(rootDir, "miscellaneous"),
  "@utils": path.join(rootDir, "utils"),
  "@types": path.join(rootDir, "types"),
  "@users": path.join(rootDir, "users"),
  "@currency": path.join(rootDir, "currency"),
  "@courses": path.join(rootDir, "courses"),
  "@payments": path.join(rootDir, "payments"),
});
