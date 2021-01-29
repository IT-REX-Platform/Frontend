import { ICourse } from "../types/ICourse";
import { ICourseParameters } from "../types/ICourseParameters";
import { sendRequest } from "./sendRequest";
import ITREXVARS from "../Constants";
import { ApiUrls } from "../constants/ApiUrls";
import { IEndpointsCourseExtended } from "./endpoints_interfaces/IEndpointsCourseExtended";
import { loggerFactory } from "../../logger/LoggerConfig";

export class EndpointsCourseExtended implements IEndpointsCourseExtended {
    private loggerApi = loggerFactory.getLogger("API.EndpointsCourseExtended");
    private url: string;

    public constructor() {
        this.url = ITREXVARS().apiUrl + ApiUrls.URL_COURSES_EXTENDED;
    }

    public getFilteredCourses(getRequest: RequestInit, params?: ICourseParameters): Promise<ICourse[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this.appendCourseParams(params);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return response.then((response) => response.json()).then((data) => data as ICourse[]);

        // return sendRequest(url, getRequest)
        //     .then((response) => response.json())
        //     .then((data) => data as ICourse[]);
    }

    private appendCourseParams(params?: ICourseParameters): string {
        let url = this.url;

        if (params === undefined) {
            return url;
        }
        url = url + "?";

        this.loggerApi.trace("Appending additional parameters to GET request URL.");
        if (params.publishState !== undefined) {
            url = `${url}publishState=${params.publishState}`; // TODO
        }

        // TODO: insert more parameters here once implemented. @slawa 29.01.21.

        return url;
    }
}
