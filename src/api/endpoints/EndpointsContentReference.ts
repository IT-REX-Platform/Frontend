import { sendRequest } from "../requests/sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { IEndpointsContentReference } from "../endpoints_interfaces/IEndpointsContentReference";
import { IContent } from "../../types/IContent";
import { ResponseParserContentReferences } from "../responses/ResponseParserContentReferences";
import { ResponseParserEmpty } from "../responses/ResponseParserEmpty";
import { Logger } from "typescript-logging";

/**
 * Endpoints for courseservice/api/contentreferences/.
 * Look in backend course-service ContentReferenceResource.java.
 */
export class EndpointsContentReference implements IEndpointsContentReference {
    private loggerApi: Logger;
    private url: string;
    private responseParserContentReferences: ResponseParserContentReferences;
    private responseParserEmpty: ResponseParserEmpty;

    public constructor() {
        this.loggerApi = loggerFactory.getLogger("API.EndpointsContentReference");
        this.url = itRexVars().apiUrl + ApiUrls.URL_CONTENTREFERENCES;
        this.responseParserContentReferences = new ResponseParserContentReferences();
        this.responseParserEmpty = new ResponseParserEmpty();
    }

    /**
     * Get one or more contentreferences.
     *
     * @param getRequest GET request.
     */
    public getAllContentReferences(
        getRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContent[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParserContentReferences.parseContentReferences(response, successMsg, errorMsg);
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
        return this.responseParserContentReferences.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Create a new ContentReference.
     *
     * @param postRequest POST request with course JSON body containing no ContentReference ID.
     */
    public createContentReference(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IContent> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParserContentReferences.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Update one or more ContentReference fields.
     *
     * @param postRequest PATCH request with ContentReference JSON body containing a ContentReference ID and one or more ContentReference fields.
     */
    public patchContentReference(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IContent> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParserContentReferences.parseContentReference(response, successMsg, errorMsg);
    }

    /**
     * Delete an existing ContentReference.
     *
     * @param deleteRequest DELETE request.
     * @param contentReferenceId ContentReference ID for URL parameter.
     */
    public deleteContentReference(
        deleteRequest: RequestInit,
        contentReferenceId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlUpdated = this.url + "/" + contentReferenceId;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParserEmpty.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
