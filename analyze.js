const scanner = require("sonarqube-scanner");

scanner(
    {
        // this example uses local instance of SQ

        serverUrl: "http://localhost:9001/",

        options: {
            "sonar.projectVersion": "1.1.0",

            "sonar.sources": "src/",

            "sonar.tests": "__tests__/",

            "sonar.typescript.lcov.reportPaths": "testOutput/lcov.info",

            "sonar.testExecutionReportPaths": "test-report.xml",
        },
    },

    () => {
        // callback is required
    }
);
