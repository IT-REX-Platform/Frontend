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

    public async getAllVideos(getRequest: RequestInit, courseId?: string): Promise<IVideo[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        let url: string = this.url;
        if (courseId !== undefined) {
            url = url + "?" + VideoUrlParams.COURSE_ID + "=" + courseId;
        }

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Response = await sendRequest(url, getRequest);
        return ResponseParser.parseVideos(response);
    }

    public async downloadVideo(getRequest: RequestInit, id: string): Promise<IVideo> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this.url + "/" + id;

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Response = await sendRequest(url, getRequest);
        return ResponseParser.parseVideo(response);
    }

    public async uploadVideo(postRequest: RequestInit): Promise<IVideo> {
        const url: string = this.url;

        this.loggerApi.trace("Sending POST request to URL: " + url);
        const response: Response = await sendRequest(url, postRequest);
        return ResponseParser.parseVideo(response);
    }

    public async deleteVideo(deleteRequest: RequestInit, id: string): Promise<IVideo> {
        this.loggerApi.trace("Checking for additional parameters for DELETE request URL.");
        const url: string = this.url + "/" + id;

        this.loggerApi.trace("Sending DELETE request to URL: " + url);
        const response: Response = await sendRequest(url, deleteRequest);
        return ResponseParser.parseVideo(response);
    }

    public getVideoUrl(id: number): string {
        return this.url + "/" + id;
    }
}
