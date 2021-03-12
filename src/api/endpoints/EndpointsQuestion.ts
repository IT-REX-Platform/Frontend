import { loggerFactory } from "../../../logger/LoggerConfig";
import { ApiUrls } from "../../constants/ApiUrls";
import { itRexVars } from "../../constants/Constants";
import { QuestionParams } from "../../constants/QuestionParams";
import { IQuestionSingleChoice, IQuestionMultipleChoice, IQuestionNumeric } from "../../types/IQuestion";
import { IEndpointsQuestion } from "../endpoints_interfaces/IEndpointsQuestion";
import { ResponseParser } from "./ResponseParser";
import { sendRequest } from "./sendRequest";

/**
 * Endpoints for quizservice/api/questions.
 * Look in backend quiz-service QuestionResource.java.
 */
export class EndpointsQuestion implements IEndpointsQuestion {
    private loggerApi = loggerFactory.getLogger("API.EndpointsQuestion");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_QUESTIONS;
        this.responseParser = new ResponseParser();
    }

    getAllQuestions(
        getRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParser.parseQuestions(response, successMsg, errorMsg);
    }

    getCourseQuestions(
        getRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]> {
        const urlUpdated: string = this.url + "?" + QuestionParams.COURSE_ID + "=" + courseId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuestions(response, successMsg, errorMsg);
    }

    getQuestion(
        getRequest: RequestInit,
        questionId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric> {
        const urlUpdated: string = this.url + "/" + questionId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuestion(response, successMsg, errorMsg);
    }

    createQuestion(
        postRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseQuestion(response, successMsg, errorMsg);
    }

    updateQuestion(
        putRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParser.parseQuestion(response, successMsg, errorMsg);
    }

    deleteQuestion(
        deleteRequest: RequestInit,
        questionId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlUpdated: string = this.url + "/" + questionId;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
