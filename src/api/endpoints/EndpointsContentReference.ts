import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseParser } from "./ResponseParser";
import { IEndpointsContentReference } from "../endpoints_interfaces/IEndpointsContentReference";
import { IContent } from "../../types/IContent";

/**
 * Endpoints for courseservice/api/contentreferences/.
 * Look in backend course-service CourseResource.java.
 */
export class EndpointsContentReference implements IEndpointsContentReference {
    private loggerApi = loggerFactory.getLogger("API.EndpointsContentReferences");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_CONTENTREFERENCES;
        this.responseParser = new ResponseParser();
    }

    /**
     * Get one or more contentreferences.
     *
     * @param getRequest GET request.
     * @param params Optional parameters for GET request URL to filter all existing courses.
     */
    public getContentReferences(getRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IContent[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParser.parseContentReferences(response, successMsg, errorMsg);
    }

    /**
     * Get one ContentReference.
     *
     * @param getRequest GET request.
     * @param chapterId ContentReference ID for URL parameter.
     */
    public getContentReference(
        getRequest: RequestInit,
        contentReferenceId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContent> {
        const urlUpdated = this.url + "/" + contentReferenceId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Create a new ContentReference.
     *
     * @param postRequest POST request with course JSON body containing no course ID.
     */
    public createContentReference(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IContent> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Update all fields of a ContentReference.
     *
     * @param postRequest PUT request with course JSON body containing a course ID and all available course fields.
     */
    public updateContentReference(putRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IContent> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParser.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Update one or more ContentReference fields.
     *
     * @param postRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     */
    public patchContentReference(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IContent> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParser.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Delete an existing ContentReference.
     *
     * @param deleteRequest DELETE request.
     * @param id Course ID for URL parameter.
     */
    public deleteContentReference(
        deleteRequest: RequestInit,
        id: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
