module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended", // Turns on recommended rules from "eslint" plugin.
        "plugin:@typescript-eslint/recommended", // Turns on recommended rules from "typescript-eslint" plugin.
        "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier.
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        // https://eslint.org/docs/rules/       // ESLint rules.
        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin        // Typescript-ESLint rules.
        "@typescript-eslint/indent": ["warn", 4],
        "@typescript-eslint/semi": ["warn", "always"],
        "@typescript-eslint/quotes": ["warn", "double"],
        "@typescript-eslint/no-explicit-any": "error",
        complexity: ["warn", 4], // Cyclomatic complexity.
    },
};
