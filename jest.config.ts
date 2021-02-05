// jest.config.ts
import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
    setupFiles: ["./setupTests.ts"],
    preset: "jest-expo",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/coverage/**",
        "!**/node_modules/**",
        "!**/logger/**",
        "!**/web-build/**",
        "!**analyze.js",
        "!**babel.config.js",
        "!**index.js",
        "!**metro.config.js",
        "!**.test.ts",
        "!**/constants/**",
        "!**.config.*",
        "!**/src/components/CreateCourseComponent.tsx",
        "!**/src/types/**",
        "!**/src/api/endpoints_interfaces/**",
    ],
    testResultsProcessor: "jest-sonar-reporter",
};
export default config;
