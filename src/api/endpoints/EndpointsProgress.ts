import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseParser } from "./ResponseParser";
import { IEndpointsProgress } from "../endpoints_interfaces/IEndpointsProgress";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { ProgressUrlPart } from "../../constants/ProgressUrlPart";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";

/**
 * Endpoints for courseservice/api/progress/.
 * Look in backend course-service ProgressResource.java.
 */
export class EndpointsProgress implements IEndpointsProgress {
    private loggerApi = loggerFactory.getLogger("API.EndpointsProgress");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_PROGRESS;
    }

    /**
     * Create a new content progress given a content reference and course tracker id.
     *
     * @param postRequest POST request
     */
    public createContentProgress(postRequest: RequestInit): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}`;

        this.loggerApi.trace("Sending POST request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, postRequest);
        return ResponseParser.parseContentProgressTracker(response);
    }

    /**
     * Get content progress for a single tracker.
     *
     * @param getRequest GET request.
     * @param trackerId the tracker ID to get the progress of.
     */
    public getContentProgress(getRequest: RequestInit, trackerId: string): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}/${trackerId}`;

        this.loggerApi.trace("Sending GET request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, getRequest);
        return ResponseParser.parseContentProgressTracker(response);
    }

    /**
     * Updates the content progress to a complete state.
     *
     * @param putRequest PUT request.
     * @param trackerId  the tracker ID to set the state of.
     */
    public setContentStateComplete(putRequest: RequestInit, trackerId: string): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}/${trackerId}/${ProgressUrlPart.SUF_COMPLETE}`;

        this.loggerApi.trace("Sending PUT request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, putRequest);
        return ResponseParser.parseContentProgressTracker(response);
    }

    /**
     * Updates the content progress to a complete state.
     *
     * @param putRequest PUT request.
     * @param trackerId  the tracker ID to set the state of.
     */
    public updateContentProgress(putRequest: RequestInit, trackerId: string): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}/${trackerId}/${ProgressUrlPart.SUF_PROGRESS}`;

        this.loggerApi.trace("Sending PUT request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, putRequest);
        return ResponseParser.parseContentProgressTracker(response);
    }

    /**
     * Get course progress for a given course by id.
     *
     * @param getRequest GET request.
     * @param courseId the course id to get the progress of.
     */
    public getCourseProgress(getRequest: RequestInit, courseId: string): Promise<ICourseProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_COURSES}/${courseId}`;

        this.loggerApi.trace("Sending GET request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, getRequest);
        return ResponseParser.parseCourseProgressTracker(response);
    }
}
