import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";

export class ResponseParserQuestion {
    private loggerApi;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserQuestion");
        this.responseToasts = new ResponseToasts();
    }

    public parseQuestions(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const questions = this._parseAsJson(response) as Promise<
                        (IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]
                    >;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(questions);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing questions: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseQuestion(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const question = this._parseAsJson(response) as Promise<
                        IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric
                    >;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(question);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing question: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve(undefined);
                });
        });
    }

    public parseQuestionMap(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<
                        Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
                    >;
                })
                .then(
                    (questionMap: Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>) => {
                        questionMap = new Map(Object.entries(questionMap));

                        this.responseToasts.toastSuccess(successMsg);
                        resolve(questionMap);
                    }
                )
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing quizzes: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve(new Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>());
                });
        });
    }

    private _parseAsJson(
        response: Response
    ): Promise<
        | (IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]
        | (IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)
        | Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
    > {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
