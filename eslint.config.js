module.exports = [
  {
    ignores: ["node_modules/**", ".next/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { window: "readonly", document: "readonly", process: "readonly" },
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {},
  },
];
