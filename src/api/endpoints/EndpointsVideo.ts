import { IVideo } from "../../types/IVideo";
import { sendRequest } from "../requests/sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsVideo } from "../endpoints_interfaces/IEndpointsVideo";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseParser } from "../responses/ResponseParser";
import { VideoUrlSuffix } from "../../constants/VideoUrlSuffix";

/**
 * Endpoints for mediaservice/api/videos.
 * Look in backend media-service VideoResource.java.
 */
export class EndpointsVideo implements IEndpointsVideo {
    private loggerApi = loggerFactory.getLogger("API.EndpointsVideo");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_VIDEOS;
        this.responseParser = new ResponseParser();
    }

    /**
     * Get one or more videos.
     *
     * @param getRequest GET request.
     * @param courseId Course ID to get all videos belonging to this course.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public findAllVideosOfACourse(
        getRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IVideo[]> {
        const urlUpdated: string = this.url + VideoUrlSuffix.COURSE + "/" + courseId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseVideos(response, successMsg, errorMsg);
    }

    /**
     * Get one video.
     *
     * @param getRequest GET request.
     * @param videoId Video ID for URL parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public downloadVideo(
        getRequest: RequestInit,
        videoId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IVideo> {
        const url: string = this.url + VideoUrlSuffix.DOWNLOAD + "/" + videoId;

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return this.responseParser.parseVideo(response, successMsg, errorMsg);
    }

    /**
     * Get a map of videos and their IDs.
     * Example URL: http://localhost:8080/services/mediaservice/api/videos/get/ids
     *
     * @param postRequest POST request
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public findAllWithIds(
        postRequest: RequestInit,
        successMsg?: string,
        errorMsg?: string
    ): Promise<Map<string, IVideo>> {
        const urlUpdated: string = this.url + VideoUrlSuffix.GET_IDS;

        this.loggerApi.trace("Sending POST request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, postRequest);
        return this.responseParser.parseVideoMap(response, successMsg, errorMsg);
    }

    /**
     * Create a new video.
     *
     * @param postRequest POST request with video JSON body containing no video ID.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public uploadVideo(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IVideo> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseVideo(response, successMsg, errorMsg, false);
    }

    /**
     * Update one or more video fields.
     *
     * @param postRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public patchVideo(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IVideo> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParser.parseVideo(response, successMsg, errorMsg);
    }

    /**
     * Delete an existing video.
     *
     * @param deleteRequest DELETE request.
     * @param videoId Video ID for URL parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public deleteVideo(
        deleteRequest: RequestInit,
        videoId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const url: string = this.url + "/" + videoId;

        this.loggerApi.trace("Sending DELETE request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, deleteRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
