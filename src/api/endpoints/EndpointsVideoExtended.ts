import { IVideo } from "../../types/IVideo";
import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsVideoExtended } from "../endpoints_interfaces/IEndpointsVideoExtended";
import { loggerFactory } from "../../../logger/LoggerConfig";

/**
 * Endpoints for mediaservice/api/extended.
 * Look in backend media-service VideoResourceExtended.java.
 */
export class EndpointsVideoExtended implements IEndpointsVideoExtended {
    private loggerApi = loggerFactory.getLogger("API.EndpointsVideoExtended");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_VIDEOS_EXTENDED;
    }

    public async getVideoById(getRequest: RequestInit, id: string): Promise<IVideo[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this.appendUrlWithId(id);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        return this.sendVideoRequest(url, getRequest);
    }

    public async uploadVideo(postRequest: RequestInit): Promise<IVideo[]> {
        const url: string = this.url;

        this.loggerApi.trace("Sending POST request to URL: " + url);
        return this.sendVideoRequest(url, postRequest);
    }

    public async deleteVideoById(deleteRequest: RequestInit, id: string): Promise<IVideo[]> {
        this.loggerApi.trace("Checking for additional parameters for DELETE request URL.");
        const url: string = this.appendUrlWithId(id);

        this.loggerApi.trace("Sending DELETE request to URL: " + url);
        return this.sendVideoRequest(url, deleteRequest);
    }

    private async sendVideoRequest(url: string, request: RequestInit): Promise<IVideo[]> {
        const response = await sendRequest(url, request);
        const data = await response.json();
        return data as IVideo[];
    }

    private appendUrlWithId(id: string): string {
        return this.url + "?id=" + id;
    }
}
