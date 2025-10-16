import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@users/(.*)$": "<rootDir>/users/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { isolatedModules: true }],
  },
  setupFiles: ["dotenv/config"],
  testMatch: ["**/__tests__/**/*.test.(ts|js)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

export default config;
