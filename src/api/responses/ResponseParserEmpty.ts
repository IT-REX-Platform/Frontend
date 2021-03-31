import { Logger } from "typescript-logging";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";

export class ResponseParserEmpty {
    private loggerApi: Logger;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserEmpty");
        this.responseToasts = new ResponseToasts();
    }

    public checkEmptyResponse(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<void> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("HTTP error: " + response.status);
                    }

                    this.responseToasts.toastSuccess(successMsg);
                    resolve();
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing empty response: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve();
                });
        });
    }
}
