import { ICourse } from "../../types/ICourse";
import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsCourseExtended } from "../endpoints_interfaces/IEndpointsCourseExtended";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { CourseUrlParams } from "../../constants/CourseUrlParams";

/**
 * Endpoints for /api/courses/extended.
 * Look in backend course-service CourseResourceExtended.java.
 */
export class EndpointsCourseExtended implements IEndpointsCourseExtended {
    private loggerApi = loggerFactory.getLogger("API.EndpointsCourseExtended");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_COURSES_EXTENDED;
    }

    public getFilteredCourses(getRequest: RequestInit, params?: ICourse): Promise<ICourse[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this.appendCourseParams(params);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return response.then((response) => response.json()).then((data) => data as ICourse[]);
    }

    private appendCourseParams(params?: ICourse): string {
        let urlUpdated = this.url;

        if (params === undefined) {
            return urlUpdated;
        }
        urlUpdated = urlUpdated + "?";

        this.loggerApi.trace("Checking for publishState.");
        if (params.publishState !== undefined) {
            urlUpdated = urlUpdated + CourseUrlParams.PUBLISH_STATE + "=" + params.publishState;
            this.loggerApi.trace(
                `Appended ${CourseUrlParams.PUBLISH_STATE} parameter to GET request URL: ${urlUpdated}`
            );
        }

        // TODO: insert checks for more ICourse params here once implemented. @s.pastuchov 29.01.21.

        return urlUpdated;
    }
}
