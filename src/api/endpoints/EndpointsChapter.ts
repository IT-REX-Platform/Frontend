import { sendRequest } from "../requests/sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { IEndpointsChapter } from "../endpoints_interfaces/IEndpointsChapter";
import { IChapter } from "../../types/IChapter";
import { ResponseParserChapter } from "../responses/ResponseParserChapter";
import { ResponseParserEmpty } from "../responses/ResponseParserEmpty";

/**
 * Endpoints for courseservice/api/chapters/.
 * Look in backend course-service ChapterResource.java.
 */
export class EndpointsChapter implements IEndpointsChapter {
    private loggerApi = loggerFactory.getLogger("API.EndpointsChapter");
    private url: string;
    private responseParserChapter: ResponseParserChapter;
    private responseParserEmpty: ResponseParserEmpty;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_CHAPTERS;
        this.responseParserChapter = new ResponseParserChapter();
        this.responseParserEmpty = new ResponseParserEmpty();
    }

    /**
     * Get one or more chapters.
     *
     * @param getRequest GET request.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getAllChapters(getRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IChapter[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParserChapter.parseChapters(response, successMsg, errorMsg);
    }

    /**
     * Get one chapter.
     *
     * @param getRequest GET request.
     * @param chapterId Chapter ID for URL parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getChapter(
        getRequest: RequestInit,
        chapterId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IChapter> {
        const urlUpdated = this.url + "/" + chapterId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParserChapter.parseChapter(response, successMsg, errorMsg);
    }

    /**
     * Create a new chapter.
     *
     * @param postRequest POST request with course JSON body containing no chapter ID.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public createChapter(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IChapter> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParserChapter.parseChapter(response, successMsg, errorMsg);
    }

    /**
     * Update one or more chapter fields.
     *
     * @param postRequest PATCH request with course JSON body containing a chapter ID and one or more chapter fields.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public patchChapter(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IChapter> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParserChapter.parseChapter(response, successMsg, errorMsg);
    }

    /**
     * Delete an existing chapter.
     *
     * @param deleteRequest DELETE request.
     * @param chapterId chapter ID for URL parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public deleteChapter(
        deleteRequest: RequestInit,
        chapterId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlUpdated = this.url + "/" + chapterId;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParserEmpty.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
