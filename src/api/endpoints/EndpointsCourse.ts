import { ICourse } from "../../types/ICourse";
import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsCourse } from "../endpoints_interfaces/IEndpointsCourse";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { CourseUrlParams } from "../../constants/CourseUrlParams";
import { ResponseParser } from "./ResponseParser";
import { CourseURLSuffix } from "../../constants/CourseURLSuffix";

/**
 * Endpoints for courseservice/api/courses/.
 * Look in backend course-service CourseResource.java.
 */
export class EndpointsCourse implements IEndpointsCourse {
    private loggerApi = loggerFactory.getLogger("API.EndpointsCourse");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_COURSES;
        this.responseParser = new ResponseParser();
    }

    /**
     * Get one or more courses.
     *
     * @param getRequest GET request.
     * @param params Optional parameters for GET request URL to filter all existing courses.
     */
    public getAllCourses(
        getRequest: RequestInit,
        params?: ICourse,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourse[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this._appendCourseParams(this.url, params);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return this.responseParser.parseCourses(response, successMsg, errorMsg);
    }

    /**
     * Get courses that belong to current user (I manage them / I joined them).
     *
     * @param getRequest GET request.
     * @param params Optional parameters for GET request URL to filter users courses.
     */
    public getUserCourses(
        getRequest: RequestInit,
        params?: ICourse,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourse[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const myCoursesURL = this.url + CourseURLSuffix.USER;
        const url: string = this._appendCourseParams(myCoursesURL, params);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return this.responseParser.parseCourses(response, successMsg, errorMsg);
    }

    /**
     * Append course filter parameters to the URL.
     *
     * @param params Optional parameters for GET request URL.
     */
    private _appendCourseParams(url: string, params?: ICourse): string {
        const urlBase = url;

        if (params === undefined) {
            return urlBase;
        }

        const urlParams = new URLSearchParams();

        this.loggerApi.trace("Checking for publishState.");
        if (params.publishState !== undefined) {
            urlParams.append(CourseUrlParams.PUBLISH_STATE, params.publishState);
            this.loggerApi.trace(`Appended ${CourseUrlParams.PUBLISH_STATE} parameter to GET request URL: ${urlBase}`);
        }

        this.loggerApi.trace("Checking for activeState.");
        if (params.activeOnly !== undefined) {
            urlParams.append(CourseUrlParams.ACTIVITY_STATE, params.activeOnly.toString());
            this.loggerApi.trace(`Appended ${CourseUrlParams.ACTIVITY_STATE} parameter to GET request URL: ${urlBase}`);
        }

        return urlBase + "?" + urlParams;
    }

    /**
     * Get one course.
     *
     * @param getRequest GET request.
     * @param id Course ID for URL parameter.
     */
    public getCourse(getRequest: RequestInit, id: string, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParser.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Create a new course.
     *
     * @param postRequest POST request with course JSON body containing no course ID.
     */
    public createCourse(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParser.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Update all fields of a course.
     *
     * @param postRequest PUT request with course JSON body containing a course ID and all available course fields.
     */
    public updateCourse(putRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return this.responseParser.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Update one or more course fields.
     *
     * @param postRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     */
    public patchCourse(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParser.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Delete an existing course.
     *
     * @param deleteRequest DELETE request.
     * @param id Course ID for URL parameter.
     */
    public deleteCourse(deleteRequest: RequestInit, id: string, successMsg?: string, errorMsg?: string): Promise<void> {
        const urlUpdated = this.url + "/" + id;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }

    /**
     * Send a request to join a course.
     *
     * @param postRequest the POST request used.
     * @param id the UUID of the course to join.
     */
    public joinCourse(postRequest: RequestInit, id: string, successMsg?: string, errorMsg?: string): Promise<void> {
        const urlJoin = this.url + "/" + id + CourseURLSuffix.JOIN;

        this.loggerApi.trace("Sending POST request to URL: " + urlJoin);
        const response: Promise<Response> = sendRequest(urlJoin, postRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }

    /**
     * Send a request to leave a course.
     *
     * @param postRequest the POST request used.
     * @param id the UUID of the course to leave.
     */
    public leaveCourse(postRequest: RequestInit, id: string, successMsg?: string, errorMsg?: string): Promise<void> {
        const urlLeave = this.url + "/" + id + CourseURLSuffix.LEAVE;

        this.loggerApi.trace("Sending POST request to URL: " + urlLeave);
        const response: Promise<Response> = sendRequest(urlLeave, postRequest);
        return this.responseParser.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
