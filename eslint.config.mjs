import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "no-unused-vars": "error", // Disallows unused variables and functions
      "no-console": "error", // Disallows console.log statements
      "prefer-const": "error", // Disallows let if variables are not reassigned
      quotes: ["error", "double"], // Enforces the use of double quotes over single quotes
      semi: ["error", "always"], // Enforces semicolons at the end of statements
      "no-multiple-empty-lines": ["error", { max: 1 }], // Disallows multiple empty lines
      "no-extra-semi": "error", // Disallows unnecessary semicolons
      camelcase: "error", // Enforces camelCase naming convention
    },
  }),
];

export default eslintConfig;
