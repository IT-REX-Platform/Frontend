const scanner = require("sonarqube-scanner");

scanner(
    {
        serverUrl: "",
        token: "0bd29dad78b1ed1a5436a3b3ad042df1c78d4f34",

        // this example uses local instance of SQ
        options: {
            "sonar.projectKey": "Frontend",
            "sonar.projectName": "Frontend",
            "sonar.projectDescription": "Frontend",
            "sonar.projectVersion": "1.1.0",
            "sonar.sources": "src/",
            "sonar.tests": "__tests__/",
            "sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
            "sonar.testExecutionReportPaths": "coverage/test-reporter.xml",
        },
    },

    () => {
        // callback is required
    }
);
