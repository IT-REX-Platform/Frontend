import { loggerFactory } from "./LoggerConfig";

// Create a logger instance.
const loggerUi = loggerFactory.getLogger("ui.LoggerExampleClass");
const loggerService = loggerFactory.getLogger("service.LoggerExampleClass");
const logger = loggerFactory.getLogger("LoggerExampleClass");

export class LoggerExampleClass {
    public static runSomeLogs(): void {
        // Create logs.
        loggerUi.info("INFO log of UI logger.");
        loggerService.debug("DEBUG log of Service logger.");
        logger.trace("TRACE log of default logger.");
    }
}

// Insert into a class to see example logs:
/*
import { LoggerExampleClass } from "./logger/LoggerExampleClass";
LoggerExampleClass.runSomeLogs();
//*/
