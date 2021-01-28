import { ICourse } from "../types/ICourse";
import { ICourseParameters } from "../types/ICourseParameters";
import { sendRequest } from "./sendRequest";
import ITREXVARS from "../Constants";
import { ApiUrls } from "../constants/ApiUrls";
import { loggerFactory } from "../../logger/LoggerConfig";

const loggerApi = loggerFactory.getLogger("API.EndpointsCourse");

export class EndpointsCourse {
    private url: string;

    public constructor() {
        this.url = ITREXVARS().apiUrl + ApiUrls.URL_COURSES;
    }

    public getAllCourses(getRequest: RequestInit, params: ICourseParameters): Promise<ICourse[]> {
        loggerApi.trace("Checking for additional parameters for GET request URL.");
        const appendParams: string = this.getAdditionalCourseParams(params);

        let url = this.url;
        if (appendParams !== "") {
            loggerApi.trace("Appending additional parameters to GET request URL.");
            url = url + "?" + appendParams;
        }

        loggerApi.trace("Sending GET request to URL: " + url);
        const response = sendRequest(url, getRequest);
        return response.then((data) => data as ICourse[]);
    }

    private getAdditionalCourseParams(params: ICourseParameters): string {
        let appendParams = "";
        if (params.publishState !== undefined) {
            appendParams = `${appendParams}publishState=${params.publishState}`;
        }
        return appendParams;
    }

    public getCourse(): void {
        // TODO 1: adjust url
        // TODO 2: send GET request to /courses/{id}
        // TODO 3: process GET response
    }

    public createCourse(postRequest: RequestInit): void {
        loggerApi.trace("Sending POST request to URL: " + this.url);
        const response = sendRequest(this.url, postRequest);
        response.then((data) => console.log(data));
    }

    public updateCourse(putRequest: RequestInit): void {
        loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response = sendRequest(this.url, putRequest);
        response.then((data) => console.log(data));
    }

    public deleteCourse(): void {
        // TODO 1: adjust url
        // TODO 2: send DELETE request to /courses/{id}
        // TODO 3: process DELETE response
    }
}
