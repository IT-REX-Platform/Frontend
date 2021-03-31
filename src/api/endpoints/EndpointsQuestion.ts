import { loggerFactory } from "../../../logger/LoggerConfig";
import { ApiUrls } from "../../constants/ApiUrls";
import { itRexVars } from "../../constants/Constants";
import { QuestionParams } from "../../constants/QuestionParams";
import { IQuestionSingleChoice, IQuestionMultipleChoice, IQuestionNumeric } from "../../types/IQuestion";
import { IEndpointsQuestion } from "../endpoints_interfaces/IEndpointsQuestion";
import { sendRequest } from "../requests/sendRequest";
import { QuestionUrlSuffix } from "../../constants/QuestionUrlSuffix";
import { ResponseParserQuestion } from "../responses/ResponseParserQuestion";
import { ResponseParserEmpty } from "../responses/ResponseParserEmpty";
import { Logger } from "typescript-logging";

/**
 * Endpoints for quizservice/api/questions.
 * Look in backend quiz-service QuestionResource.java.
 */
export class EndpointsQuestion implements IEndpointsQuestion {
    private loggerApi: Logger;
    private url: string;
    private responseParserQuestion: ResponseParserQuestion;
    private responseParserEmpty: ResponseParserEmpty;

    public constructor() {
        this.loggerApi = loggerFactory.getLogger("API.EndpointsQuestion");
        this.url = itRexVars().apiUrl + ApiUrls.URL_QUESTIONS;
        this.responseParserQuestion = new ResponseParserQuestion();
        this.responseParserEmpty = new ResponseParserEmpty();
    }

    getAllQuestions(
        getRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParserQuestion.parseQuestions(response, successMsg, errorMsg);
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
        return this.responseParserQuestion.parseQuestions(response, successMsg, errorMsg);
    }

    getQuestion(
        getRequest: RequestInit,
        questionId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined> {
        const urlUpdated: string = this.url + "/" + questionId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParserQuestion.parseQuestion(response, successMsg, errorMsg);
    }

    /**
     * Get a map of questions and their IDs.
     * Example URL: http://localhost:8080/services/quizservice/api/questions/get/ids
     *
     * @param postRequest POST request.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public findAllByIds(
        postRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>> {
        const urlUpdated: string = this.url + QuestionUrlSuffix.GET_IDS;

        this.loggerApi.trace("Sending POST request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, postRequest);
        return this.responseParserQuestion.parseQuestionMap(response, successMsg, errorMsg);
    }

    createQuestion(
        postRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParserQuestion.parseQuestion(response, successMsg, errorMsg);
    }

    updateQuestion(
        putRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParserQuestion.parseQuestion(response, successMsg, errorMsg);
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
        return this.responseParserEmpty.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
