import { IContent } from "../../types/IContent";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";

export class ResponseParserContentReferences {
    private loggerApi;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserContentReferences");
        this.responseToasts = new ResponseToasts();
    }

    public parseContentReferences(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContent[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const contents = this._parseAsJson(response) as Promise<IContent[]>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(contents);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing contents: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseContentReference(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContent> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const content = this._parseAsJson(response) as Promise<IContent>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(content);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing content: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve({});
                });
        });
    }

    private _parseAsJson(response: Response): Promise<IContent[] | IContent> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
