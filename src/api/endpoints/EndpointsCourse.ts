import { ICourse } from "../../types/ICourse";
import { sendRequest } from "../requests/sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsCourse } from "../endpoints_interfaces/IEndpointsCourse";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { CourseUrlParams } from "../../constants/CourseUrlParams";
import { CourseUrlSuffix } from "../../constants/CourseUrlSuffix";
import { CoursePublishState } from "../../constants/CoursePublishState";
import { ResponseParserCourse } from "../responses/ResponseParserCourse";
import { ResponseParserEmpty } from "../responses/ResponseParserEmpty";
import { Logger } from "typescript-logging";
import { setCourseCounter } from "../../services/CourseCounterService";

/**
 * Endpoints for courseservice/api/courses/.
 * Look in backend course-service CourseResource.java.
 */
export class EndpointsCourse implements IEndpointsCourse {
    private loggerApi: Logger;
    private url: string;
    private responseParserCourse: ResponseParserCourse;
    private responseParserEmpty: ResponseParserEmpty;

    public constructor() {
        this.loggerApi = loggerFactory.getLogger("API.EndpointsCourse");
        this.url = itRexVars().apiUrl + ApiUrls.URL_COURSES;
        this.responseParserCourse = new ResponseParserCourse();
        this.responseParserEmpty = new ResponseParserEmpty();
    }

    /**
     * Get one or more courses.
     *
     * @param getRequest GET request.
     * @param publishState Optional published courses only parameter.
     * @param activeOnly Optional active courses only parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getAllCourses(
        getRequest: RequestInit,
        publishState?: CoursePublishState,
        activeOnly?: boolean,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourse[]> {
        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this._appendCourseParams(this.url, publishState, activeOnly);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return this.responseParserCourse.parseCourses(response, successMsg, errorMsg);
    }

    /**
     * Get courses that belong to current user (I manage them / I joined them).
     *
     * @param getRequest GET request.
     * @param publishState Optional published courses only parameter.
     * @param activeOnly Optional active courses only parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getUserCourses(
        getRequest: RequestInit,
        publishState?: CoursePublishState,
        activeOnly?: boolean,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourse[]> {
        const myCoursesURL = this.url + CourseUrlSuffix.USER;

        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this._appendCourseParams(myCoursesURL, publishState, activeOnly);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        const courses: Promise<ICourse[]> = this.responseParserCourse.parseCourses(response, successMsg, errorMsg);

        // Set counter for user courses, to prevent having more courses than it is allowed in MaxCoursesAllowed.ts.
        courses.then((courses) => setCourseCounter(courses.length));

        return courses;
    }

    /**
     * Get published courses.
     *
     * @param getRequest GET request.
     * @param activeOnly Optional active courses only parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getAllPublishedCourses(
        getRequest: RequestInit,
        activeOnly?: boolean,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourse[]> {
        const myCoursesURL = this.url + CourseUrlSuffix.PUBLISHED;

        this.loggerApi.trace("Checking for additional parameters for GET request URL.");
        const url: string = this._appendCourseParams(myCoursesURL, undefined, activeOnly);

        this.loggerApi.trace("Sending GET request to URL: " + url);
        const response: Promise<Response> = sendRequest(url, getRequest);
        return this.responseParserCourse.parseCourses(response, successMsg, errorMsg);
    }

    /**
     * Append course filter parameters to the URL.
     *
     * @param url Original URL.
     * @param publishState Published courses only parameter.
     * @param activeOnly Active courses only parameter.
     * @returns Adjusted URL with params.
     */
    private _appendCourseParams(url: string, publishState?: CoursePublishState, activeOnly?: boolean): string {
        const urlParams: URLSearchParams = new URLSearchParams();

        this.loggerApi.trace("Checking for publishState.");
        if (publishState != undefined) {
            urlParams.append(CourseUrlParams.PUBLISH_STATE, publishState);
            this.loggerApi.trace(`Appended ${CourseUrlParams.PUBLISH_STATE} parameter to GET request URL: ${url}`);
        }

        this.loggerApi.trace("Checking for activeState.");
        if (activeOnly != undefined) {
            urlParams.append(CourseUrlParams.ACTIVITY_STATE, activeOnly.toString());
            this.loggerApi.trace(`Appended ${CourseUrlParams.ACTIVITY_STATE} parameter to GET request URL: ${url}`);
        }

        return url + "?" + urlParams;
    }

    /**
     * Get one course.
     *
     * @param getRequest GET request.
     * @param courseId Course ID for URL parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public getCourse(
        getRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourse> {
        const urlUpdated = this.url + "/" + courseId;

        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return this.responseParserCourse.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Create a new course.
     *
     * @param postRequest POST request with course JSON body containing no course ID.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public createCourse(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return this.responseParserCourse.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Send a request to join a course.
     *
     * @param postRequest the POST request used.
     * @param courseId the UUID of the course to join.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public joinCourse(
        postRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlJoin = this.url + "/" + courseId + CourseUrlSuffix.JOIN;

        this.loggerApi.trace("Sending POST request to URL: " + urlJoin);
        const response: Promise<Response> = sendRequest(urlJoin, postRequest);
        return this.responseParserEmpty.checkEmptyResponse(response, successMsg, errorMsg);
    }

    /**
     * Send a request to leave a course.
     *
     * @param postRequest the POST request used.
     * @param courseId the UUID of the course to leave.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public leaveCourse(
        postRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlLeave = this.url + "/" + courseId + CourseUrlSuffix.LEAVE;

        this.loggerApi.trace("Sending POST request to URL: " + urlLeave);
        const response: Promise<Response> = sendRequest(urlLeave, postRequest);
        return this.responseParserEmpty.checkEmptyResponse(response, successMsg, errorMsg);
    }

    /**
     * Update one or more course fields.
     *
     * @param patchRequest PATCH request with course JSON body containing a course ID and one or more course fields.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public patchCourse(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        this.loggerApi.trace("Sending PATCH request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, patchRequest);
        return this.responseParserCourse.parseCourse(response, successMsg, errorMsg);
    }

    /**
     * Delete an existing course.
     *
     * @param deleteRequest DELETE request.
     * @param courseId Course ID for URL parameter.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns
     */
    public deleteCourse(
        deleteRequest: RequestInit,
        courseId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<void> {
        const urlUpdated = this.url + "/" + courseId;

        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        return this.responseParserEmpty.checkEmptyResponse(response, successMsg, errorMsg);
    }
}
