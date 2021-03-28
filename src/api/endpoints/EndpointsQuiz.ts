import { loggerFactory } from "../../../logger/LoggerConfig";
import { ApiUrls } from "../../constants/ApiUrls";
import { itRexVars } from "../../constants/Constants";
import { QuizParams } from "../../constants/QuizParams";
import { IQuiz } from "../../types/IQuiz";
import { IEndpointsQuiz } from "../endpoints_interfaces/IEndpointsQuiz";
import { ResponseParser } from "../responses/ResponseParser";
import { sendRequest } from "../requests/sendRequest";

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

    /**
     * Get one or more quizzes.
     *
     * @param getRequest GET request.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    getAllQuizzes(getRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParser.parseQuizzes(response, successMsg, errorMsg);
    }

    /**
     * Get all quizzes of a course.
     *
     * @param getRequest GET request.
     * @param courseId ID of course to which the quiz belongs.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    getCourseQuizzes(
        getRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuiz[]> {
        const urlUpdated: string = this.url + "?" + QuizParams.COURSE_ID + "=" + courseId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuizzes(response, successMsg, errorMsg);
    }

    /**
     * Get one quiz.
     *
     * @param getRequest GET request.
     * @param quizId ID of a quiz.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    getQuiz(
        getRequest: RequestInit,
        quizId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuiz | undefined> {
        const urlUpdated: string = this.url + "/" + quizId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuiz(response, successMsg, errorMsg);
    }

    /**
     * Create a new quiz.
     *
     * @param postRequest POST request with quiz JSON body.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    createQuiz(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz | undefined> {
        //TODO: ADD  QUIZ TO CONTENT TO THE CHAPTER;
        // TODO: eh?

        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseQuiz(response, successMsg, errorMsg);
    }

    /**
     * Update a quiz.
     *
     * @param putRequest PUT request with quiz JSON body
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    updateQuiz(putRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz | undefined> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParser.parseQuiz(response, successMsg, errorMsg);
    }

    /**
     * Delete a quiz.
     *
     * @param deleteRequest DELETE request.
     * @param quizId ID of a quiz.
     * @param withQuestions Boolean determines whether the quiz is deleted with all its questions or not.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    deleteQuiz(
        deleteRequest: RequestInit,
        quizId: string,
        withQuestions?: boolean,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        let urlUpdated: string = this.url + "/" + quizId;
        if (withQuestions != undefined) {
            urlUpdated = urlUpdated + "?" + QuizParams.WITH_QUESTIONS + "=" + withQuestions;
        }

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }

    public findAllWithIds(
        getRequest: RequestInit,
        videoIds: string[],
        successMsg?: string,
        errorMsg?: string
    ): Promise<Map<string, IQuiz>> {
        // http://localhost:8080/services/quizservice/api/quizzes/?quiz_ids=e4997cee-cfc1-45d1-ab4e-7b2bc0c60e75,2f91abb3-a2fa-4050-96df-b2aa2a7e6d0b
        const quizIdsString: string = videoIds.join(",");
        const urlUpdated: string = this.url + "/?" + QuizParams.QUIZ_IDS + "=" + quizIdsString;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseQuizMap(response, successMsg, errorMsg);
    }
}
