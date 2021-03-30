import { sendRequest } from "../requests/sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { IEndpointsProgress } from "../endpoints_interfaces/IEndpointsProgress";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { ProgressUrlPart } from "../../constants/ProgressUrlPart";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { ResponseParserProgress } from "../responses/ResponseParserProgress";

/**
 * Endpoints for courseservice/api/progress/.
 * Look in backend course-service ProgressResource.java.
 */
export class EndpointsProgress implements IEndpointsProgress {
    private loggerApi = loggerFactory.getLogger("API.EndpointsProgress");
    private url: string;
    private responseParserProgress: ResponseParserProgress;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_PROGRESS;
        this.responseParserProgress = new ResponseParserProgress();
    }

    /**
     * Create a new content progress given a content reference and course tracker id.
     *
     * @param postRequest POST request
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public createContentProgress(
        postRequest: RequestInit,
        courseTrackerId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}?courseTrackerId=${courseTrackerId}`;

        this.loggerApi.trace("Sending POST request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, postRequest);
        return this.responseParserProgress.parseContentProgressTracker(response, successMsg, errorMsg);
    }

    /**
     * Get content progress for a single tracker.
     *
     * @param getRequest GET request.
     * @param trackerId the tracker ID to get the progress of.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getContentProgress(
        getRequest: RequestInit,
        trackerId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}/${trackerId}`;

        this.loggerApi.trace("Sending GET request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, getRequest);
        return this.responseParserProgress.parseContentProgressTracker(response, successMsg, errorMsg);
    }

    /**
     * Updates the content progress to a complete state.
     *
     * @param putRequest PUT request.
     * @param trackerId  the tracker ID to set the state of.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public setContentStateComplete(
        putRequest: RequestInit,
        trackerId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContentProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_CONTENT}/${trackerId}/${ProgressUrlPart.SUF_COMPLETE}`;

        this.loggerApi.trace("Sending PUT request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, putRequest);
        return this.responseParserProgress.parseContentProgressTracker(response, successMsg, errorMsg);
    }

    /**
     * Updates the content progress to a complete state.
     *
     * @param putRequest PUT request.
     * @param trackerId  the tracker ID to set the state of.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public updateContentProgress(
        putRequest: RequestInit,
        trackerId: string,
        progress: number,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContentProgressTracker> {
        const urlToUse =
            `${this.url}/${ProgressUrlPart.MID_CONTENT}/${trackerId}/${ProgressUrlPart.SUF_PROGRESS}` +
            `?progress=${progress}`;

        this.loggerApi.trace("Sending PUT request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, putRequest);
        return this.responseParserProgress.parseContentProgressTracker(response, successMsg, errorMsg);
    }

    /**
     * Get course progress for a given course by id.
     *
     * @param getRequest GET request.
     * @param courseId the course id to get the progress of.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getCourseProgress(
        getRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourseProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_COURSES}/${courseId}`;

        this.loggerApi.trace("Sending GET request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, getRequest);
        return this.responseParserProgress.parseCourseProgressTracker(response, successMsg, errorMsg);
    }

    /**
     * Update the last accessed content progress for a course tracker.
     *
     * @param putRequest PUT request.
     * @param crsTrackerId the course tracker id to update the last accessed ref of.
     * @param successMsg the success message.
     * @param errorMsg the error message.
     * @returns
     */
    public updateLastAccessedContentProgress(
        putRequest: RequestInit,
        crsTrackerId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourseProgressTracker> {
        const urlToUse = `${this.url}/${ProgressUrlPart.MID_COURSES}/${crsTrackerId}/${ProgressUrlPart.SUF_CONTENTREF}`;

        this.loggerApi.trace("Sending PUT request to URL: " + urlToUse);
        const response: Promise<Response> = sendRequest(urlToUse, putRequest);
        return this.responseParserProgress.parseCourseProgressTracker(response, successMsg, errorMsg);
    }
}
