const scanner = require("sonarqube-scanner");

scanner(
    {
        serverUrl: "https://localhost:9001",
        // this example uses local instance of SQ
        options: {
            "sonar.projectName": "Frontend",
            "sonar.projectDescription": "Frontend",
            "sonar.projectVersion": "1.1.0",
            "sonar.sources": "src/",
            "sonar.tests": "__tests__/",
            "sonar.typescript.lcov.reportPaths": "coverage/lcov.info",
            "sonar.testExecutionReportPaths": "coverage/junit.xml",
        },
    },

    () => {
        // callback is required
    }
);
