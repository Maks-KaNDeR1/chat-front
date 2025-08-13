import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      "no-undef": "error",
      "@next/next/no-img-element": "off",
      "object-curly-spacing": ["warn", "never"],
      "brace-style": ["error", "1tbs"],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-infix-ops": ["error", {int32Hint: true}],
      semi: "error",
      "no-multiple-empty-lines": ["error", {max: 1}],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: ["return", "class", "directive", "block-like"],
        },
        {
          blankLine: "always",
          prev: ["block-like"],
          next: "*",
        },
      ],
      "eol-last": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "no-multi-spaces": ["error"],
      "no-trailing-spaces": ["error"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "no-empty-pattern": "off",
    },
  },
];

export default eslintConfig;
