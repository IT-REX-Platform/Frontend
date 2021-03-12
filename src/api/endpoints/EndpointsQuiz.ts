import { loggerFactory } from "../../../logger/LoggerConfig";
import { ApiUrls } from "../../constants/ApiUrls";
import { itRexVars } from "../../constants/Constants";
import { QuizParams } from "../../constants/QuizParams";
import { IQuiz } from "../../types/IQuiz";
import { IEndpointsQuiz } from "../endpoints_interfaces/IEndpointsQuiz";
import { ResponseParser } from "./ResponseParser";
import { sendRequest } from "./sendRequest";

/**
 * Endpoints for mediaservice/api/quizzes.
 * Look in backend media-service QuizResource.java.
 */
export class EndpointsQuiz implements IEndpointsQuiz {
    private loggerApi = loggerFactory.getLogger("API.EndpointsQuiz");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_QUIZZES;
        this.responseParser = new ResponseParser();
    }

    getAllQuizzes(getRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParser.parseQuizzes(response, successMsg, errorMsg);
    }

    getCourseQuizzes(
        getRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuiz[]> {
        const urlUpdated: string = this.url + "/" + courseId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuizzes(response, successMsg, errorMsg);
    }

    getQuiz(getRequest: RequestInit, quizId: string, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        const urlUpdated: string = this.url + "/" + quizId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuiz(response, successMsg, errorMsg);
    }

    createQuiz(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseQuiz(response, successMsg, errorMsg);
    }

    updateQuiz(putRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParser.parseQuiz(response, successMsg, errorMsg);
    }

    deleteQuiz(
        deleteRequest: RequestInit,
        quizId: string,
        withQuestions?: boolean,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        let urlUpdated = this.url + "/" + quizId;
        if (withQuestions != undefined) {
            urlUpdated = urlUpdated + "?" + QuizParams.WITH_QUESTIONS + "=" + withQuestions;
        }

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
