import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseParser } from "./ResponseParser";
import { IEndpointsChapter } from "../endpoints_interfaces/IEndpointsChapter";
import { IChapter } from "../../types/IChapter";

/**
 * Endpoints for courseservice/api/courses/.
 * Look in backend course-service CourseResource.java.
 */
export class EndpointsChapter implements IEndpointsChapter {
    private loggerApi = loggerFactory.getLogger("API.EndpointsChapter");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_CHAPTERS;
        this.responseParser = new ResponseParser();
    }

    /**
     * Get one or more courses.
     *
     * @param getRequest GET request.
     * @param params Optional parameters for GET request URL to filter all existing courses.
     */
    public getChapters(getRequest: RequestInit): Promise<IChapter[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParser.parseChapters(response);
    }

    /**
     * Get one course.
     *
     * @param getRequest GET request.
     * @param id Course ID for URL parameter.
     */
    public getChapter(getRequest: RequestInit, id: string): Promise<IChapter> {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseChapter(response);
    }

    /**
     * Create a new course.
     *
     * @param postRequest POST request with course JSON body containing no course ID.
     */
    public createChapter(postRequest: RequestInit): Promise<IChapter> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseChapter(response);
    }

    /**
     * Update all fields of a course.
     *
     * @param postRequest PUT request with course JSON body containing a course ID and all available course fields.
     */
    public updateChapter(putRequest: RequestInit): Promise<IChapter> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParser.parseChapter(response);
    }

    /**
     * Update one or more course fields.
     *
     * @param postRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     */
    public patchChapter(patchRequest: RequestInit): Promise<IChapter> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParser.parseChapter(response);
    }

    /**
     * Delete an existing course.
     *
     * @param deleteRequest DELETE request.
     * @param id Course ID for URL parameter.
     */
    public deleteChapter(deleteRequest: RequestInit, id: string): Promise<void> {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParser.checkEmptyResponse(response);
    }
}
