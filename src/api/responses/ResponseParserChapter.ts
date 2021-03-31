import { IChapter } from "../../types/IChapter";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";
import { Logger } from "typescript-logging";

export class ResponseParserChapter {
    private loggerApi: Logger;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserChapter");
        this.responseToasts = new ResponseToasts();
    }

    public parseChapters(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IChapter[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const chapters = this._parseAsJson(response) as Promise<IChapter[]>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(chapters);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapters: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseChapter(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IChapter> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const chapter = this._parseAsJson(response) as Promise<IChapter>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(chapter);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapter: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve({});
                });
        });
    }

    private _parseAsJson(response: Response): Promise<IChapter[] | IChapter> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
