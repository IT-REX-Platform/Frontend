import { IQuiz } from "../../types/IQuiz";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";
import { Logger } from "typescript-logging";

export class ResponseParserQuiz {
    private loggerApi: Logger;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserQuiz");
        this.responseToasts = new ResponseToasts();
    }

    public parseQuizzes(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IQuiz[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const quizzes = this._parseAsJson(response) as Promise<IQuiz[]>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(quizzes);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing quizzes: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseQuiz(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IQuiz | undefined> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const quiz = this._parseAsJson(response) as Promise<IQuiz>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(quiz);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing quiz: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve(undefined);
                });
        });
    }

    public parseQuizMap(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<Map<string, IQuiz>> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<Map<string, IQuiz>>;
                })
                .then((quizMap: Map<string, IQuiz>) => {
                    quizMap = new Map(Object.entries(quizMap));

                    this.responseToasts.toastSuccess(successMsg);
                    resolve(quizMap);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing quizzes: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve(new Map<string, IQuiz>());
                });
        });
    }

    private _parseAsJson(response: Response): Promise<IQuiz[] | IQuiz | Map<string, IQuiz>> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
