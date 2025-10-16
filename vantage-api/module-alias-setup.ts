import moduleAlias from "module-alias";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const rootDir = isProduction ? path.join(__dirname, "..") : __dirname;

// Register the aliases
moduleAlias.addAliases({
  "@": isProduction ? path.join(rootDir, "/vantage-api") : path.join(rootDir),
  "@config": isProduction
    ? path.join(rootDir, "/vantage-api/config")
    : path.join(rootDir, "config"),
  "@database": isProduction
    ? path.join(rootDir, "/vantage-api/database")
    : path.join(rootDir, "database"),
  "@middlewares": isProduction
    ? path.join(rootDir, "/vantage-api/middlewares")
    : path.join(rootDir, "middlewares"),
  "@miscellaneous": isProduction
    ? path.join(rootDir, "/vantage-api/miscellaneous")
    : path.join(rootDir, "miscellaneous"),
  "@utils": isProduction
    ? path.join(rootDir, "/vantage-api/utils")
    : path.join(rootDir, "utils"),
  "@types": isProduction
    ? path.join(rootDir, "/vantage-api/types")
    : path.join(rootDir, "types"),
  "@users": isProduction
    ? path.join(rootDir, "/vantage-api/users")
    : path.join(rootDir, "users"),
  "@currency": isProduction
    ? path.join(rootDir, "/vantage-api/currency")
    : path.join(rootDir, "currency"),
  "@courses": isProduction
    ? path.join(rootDir, "/vantage-api/courses")
    : path.join(rootDir, "courses"),
  "@payments": isProduction
    ? path.join(rootDir, "/vantage-api/payments")
    : path.join(rootDir, "payments"),
});
