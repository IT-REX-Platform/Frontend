import { IVideo } from "../../types/IVideo";
import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsVideo } from "../endpoints_interfaces/IEndpointsVideo";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseParser } from "./ResponseParser";
import { VideoUrlParams } from "../../constants/VideoUrlParams";

/**
 * Endpoints for mediaservice/api/videos.
 * Look in backend media-service VideoResource.java.
 */
export class EndpointsVideo implements IEndpointsVideo {
    private loggerApi = loggerFactory.getLogger("API.EndpointsVideo");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_VIDEOS;
    }

    /**
     * Get one or more videos.
     *
     * @param getRequest GET request.
     * @param courseId Course ID to get all videos belonging to this course.
     */
    public getAllVideos(getRequest: RequestInit, courseId?: string): Promise<IVideo[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        let url: string = this.url;
        if (courseId !== undefined) {
            url = url + "?" + VideoUrlParams.COURSE_ID + "=" + courseId;
        }

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return ResponseParser.parseVideos(response);
    }

    /**
     * Get one video.
     *
     * @param getRequest GET request.
     * @param id Video ID for URL parameter.
     */
    public downloadVideo(getRequest: RequestInit, id: string): Promise<IVideo> {
        const url: string = this.url + "/" + id;

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return ResponseParser.parseVideo(response);
    }

    /**
     * Create a new video.
     *
     * @param postRequest POST request with video JSON body containing no video ID.
     */
    public uploadVideo(postRequest: RequestInit): Promise<IVideo> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return ResponseParser.parseVideo(response);
    }

    /**
     * Update one or more video fields.
     *
     * @param postRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     */
    public patchVideo(patchRequest: RequestInit): Promise<IVideo> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return ResponseParser.parseVideo(response);
    }

    /**
     * Delete an existing video.
     *
     * @param deleteRequest DELETE request.
     * @param id Video ID for URL parameter.
     */
    public deleteVideo(deleteRequest: RequestInit, id: string): Promise<Response> {
        const url: string = this.url + "/" + id;

        this.loggerApi.trace("Sending DELETE request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, deleteRequest);
        return response;
    }
}
