module.exports = {
    env: {
        browser: true,
        es2021: true,
        "react-native/react-native": true,
    },
    extends: [
        "eslint:recommended", // Enables recommended rules from "eslint" plugin.
        "plugin:@typescript-eslint/eslint-recommended", // Disables rules from eslint:recommended which are already handled by TypeScript.
        "plugin:@typescript-eslint/recommended", // Enables recommended rules from "typescript-eslint" plugin.
        "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier.
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["@typescript-eslint", "prettier", "react", "react-native"],
    rules: {
        // https://eslint.org/docs/rules/   // ESLint rules.
        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin   // Typescript-ESLint rules.
        "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/semi": ["warn", "always"],
        "@typescript-eslint/quotes": ["warn", "double"],
        "@typescript-eslint/no-explicit-any": "error",
        complexity: ["warn", 4], // Cyclomatic complexity.
        "max-len": ["warn", { code: 120, ignoreComments: true, ignoreTrailingComments: true, ignoreUrls: true }],
        "max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
        "react-native/no-unused-styles": 2,
    },
};
