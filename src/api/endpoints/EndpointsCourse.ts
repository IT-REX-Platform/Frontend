import { ICourse } from "../../types/ICourse";
import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsCourse } from "../endpoints_interfaces/IEndpointsCourse";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { CourseUrlParams } from "../../constants/CourseUrlParams";
import { ResponseParser } from "./ResponseParser";

/**
 * Endpoints for courseservice/api/courses/.
 * Look in backend course-service CourseResource.java.
 */
export class EndpointsCourse implements IEndpointsCourse {
    private loggerApi = loggerFactory.getLogger("API.EndpointsCourse");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_COURSES;
    }

    /**
     * Get one or more courses.
     *
     * @param getRequest GET request.
     * @param params Optional parameters for GET request URL to filter all existing courses.
     */
    public getAllCourses(getRequest: RequestInit, params?: ICourse): Promise<ICourse[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this.appendCourseParams(params);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return ResponseParser.parseCourses(response);
    }

    /**
     * Append course filter parameters to the URL.
     *
     * @param params Optional parameters for GET request URL.
     */
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

    /**
     * Get one course.
     *
     * @param getRequest GET request.
     * @param id Course ID for URL parameter.
     */
    public getCourse(getRequest: RequestInit, id: string): Promise<ICourse> {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return ResponseParser.parseCourse(response);
    }

    /**
     * Create a new course.
     *
     * @param postRequest POST request with course JSON body containing no course ID.
     */
    public createCourse(postRequest: RequestInit): Promise<ICourse> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return ResponseParser.parseCourse(response);
    }

    /**
     * Update all fields of a course.
     *
     * @param postRequest PUT request with course JSON body containing a course ID and all available course fields.
     */
    public updateCourse(putRequest: RequestInit): Promise<ICourse> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return ResponseParser.parseCourse(response);
    }

    /**
     * Update one or more course fields.
     *
     * @param postRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     */
    public patchCourse(patchRequest: RequestInit): Promise<ICourse> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return ResponseParser.parseCourse(response);
    }

    /**
     * Delete an existing course.
     *
     * @param deleteRequest DELETE request.
     * @param id Course ID for URL parameter.
     */
    public deleteCourse(deleteRequest: RequestInit, id: string): void {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        response.then((data) => console.log(data));
    }

    /**
     * Send a request to join a course.
     *
     * @param postRequest the POST request used.
     * @param id the UUID of the course to join.
     */
    joinCourse(postRequest: RequestInit, id: string): void {
        const urlJoin = this.url + "/" + id + "/join";

        this.loggerApi.trace("Sending POST request to URL: " + urlJoin);
        const response: Promise<Response> = sendRequest(urlJoin, postRequest);
        response.then((data) => console.log(data));
    }

    /**
     * Send a request to leave a course.
     *
     * @param postRequest the POST request used.
     * @param id the UUID of the course to leave.
     */
    leaveCourse(postRequest: RequestInit, id: string): void {
        const urlLeave = this.url + "/" + id + "/leave";

        this.loggerApi.trace("Sending POST request to URL: " + urlLeave);
        const response: Promise<Response> = sendRequest(urlLeave, postRequest);
        response.then((data) => console.log(data));
    }
}
