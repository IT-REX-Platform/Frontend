import { LoggerFactoryOptions, LogGroupRule, LogLevel, LoggerFactory, LFService } from "typescript-logging";

const loggerFactoryOptions = new LoggerFactoryOptions();

loggerFactoryOptions.addLogGroupRule(new LogGroupRule(new RegExp("service.+"), LogLevel.Info)); // Logger output will show: [service.ClassNameHere]
loggerFactoryOptions.addLogGroupRule(new LogGroupRule(new RegExp("API.+"), LogLevel.Info)); // Logger output will show: [API.ClassNameHere]

// Logger examples.
loggerFactoryOptions.addLogGroupRule(new LogGroupRule(new RegExp("UI.+"), LogLevel.Info)); // Logger output will show: [UI.ClassNameHere]
loggerFactoryOptions.addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Info)); // Logger output will show: [ClassNameHere]

export const loggerFactory: LoggerFactory = LFService.createNamedLoggerFactory("IT-REX_logger", loggerFactoryOptions);

/*
Logger "typescript-logging" docs:
NPM: https://www.npmjs.com/package/typescript-logging
GitHub: https://github.com/vauxite-org/typescript-logging
Doc: https://github.com/vauxite-org/typescript-logging/blob/HEAD/docs/latest_log4j.md
//*/
