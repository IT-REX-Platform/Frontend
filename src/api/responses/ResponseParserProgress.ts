import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";

export class ResponseParserProgress {
    private loggerApi;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserProgress");
        this.responseToasts = new ResponseToasts();
    }

    public parseContentProgressTracker(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContentProgressTracker> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<IContentProgressTracker>;
                })
                .then((contentProgressTracker: IContentProgressTracker) => {
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(contentProgressTracker);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing content progress tracker.", error);
                    this.responseToasts.toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseCourseProgressTracker(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourseProgressTracker> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<ICourseProgressTracker>;
                })
                .then((courseProgressTracker: ICourseProgressTracker) => {
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(courseProgressTracker);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing course data.", error);
                    this.responseToasts.toastError(errorMsg);
                    resolve({});
                });
        });
    }

    private _parseAsJson(response: Response): Promise<IContentProgressTracker | ICourseProgressTracker> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
