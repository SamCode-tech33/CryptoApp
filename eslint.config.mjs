import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "eslint:recommended",
      "plugin:react/recommended",
    ],
    rules: {
      "no-unused-vars": "error", // Disallows unused variables and functions
      "no-console": "error", // Disallows console.log statements
      "prefer-const": "error", // Disallows let if variables are not reassigned
      quotes: ["error", "double"], // Enforces the use of double quotes over single quotes
      semi: ["error", "always"], // Enforces semicolons at the end of statements
      "no-multiple-empty-lines": ["error", { max: 1 }], // Disallows multiple empty lines
      "no-extra-semi": "error", // Disallows unnecessary semicolons
      "@typescript-eslint/no-explicit-any": ["off"],
      "react/no-array-index-key": "warn",
      "react/react-in-jsx-scope": "off",
      "no-undef": "off",
    },
    plugins: ["react"],

    settings: {
      react: {
        version: "detect",
      },
    },
  }),
];

export default eslintConfig;
