import { ICourse } from "../../types/ICourse";
import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { IEndpointsCourse } from "../endpoints_interfaces/IEndpointsCourse";
import { loggerFactory } from "../../../logger/LoggerConfig";

/**
 * Endpoints for /api/courses.
 * Look in backend course-service CourseResource.java.
 */
export class EndpointsCourse implements IEndpointsCourse {
    private loggerApi = loggerFactory.getLogger("API.EndpointsCourse");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_COURSES;
    }

    public getAllCourses(getRequest: RequestInit): Promise<ICourse[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return response.then((response) => response.json()).then((data) => data as ICourse[]);
    }

    public getCourse(getRequest: RequestInit, id: number): Promise<ICourse> {
        const urlUpdated = this.url + "/" + id;
        this.loggerApi.trace("Sending GET request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, getRequest);
        return response.then((response) => response.json()).then((data) => data as ICourse);
    }

    public createCourse(postRequest: RequestInit): Promise<ICourse> {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        return response.then((response) => response.json()).then((data) => data as ICourse);
    }

    public updateCourse(putRequest: RequestInit): Promise<ICourse> {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        return response.then((response) => response.json()).then((data) => data as ICourse);
    }

    public deleteCourse(deleteRequest: RequestInit, id: number): void {
        const urlUpdated = this.url + "/" + id;
        this.loggerApi.trace("Sending DELETE request to URL: " + urlUpdated);
        const response: Promise<Response> = sendRequest(urlUpdated, deleteRequest);
        response.then((data) => console.log(data));
    }
}
