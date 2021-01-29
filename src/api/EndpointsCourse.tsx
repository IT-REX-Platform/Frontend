import { ICourse } from "../types/ICourse";
import { sendRequest } from "./sendRequest";
import ITREXVARS from "../Constants";
import { ApiUrls } from "../constants/ApiUrls";
import { IEndpointsCourse } from "./endpoints_interfaces/IEndpointsCourse";
import { loggerFactory } from "../../logger/LoggerConfig";

export class EndpointsCourse implements IEndpointsCourse {
    private loggerApi = loggerFactory.getLogger("API.EndpointsCourse");
    private url: string;

    public constructor() {
        this.url = ITREXVARS().apiUrl + ApiUrls.URL_COURSES;
    }

    public getAllCourses(getRequest: RequestInit): Promise<ICourse[]> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);

        const response: Promise<Response> = sendRequest(this.url, getRequest);

        return response.then((response) => response.json()).then((data) => data as ICourse[]);

        // return sendRequest(this.url, getRequest)
        //     .then((response) => response.json())
        //     .then((data) => data as ICourse[]);
    }

    public getCourse(): void {
        // TODO 1: adjust url
        // TODO 2: send GET request to /courses/{id}
        // TODO 3: process GET response
    }

    public createCourse(postRequest: RequestInit): void {
        this.loggerApi.trace("Sending POST request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, postRequest);
        response.then((response) => response.json()).then((data) => console.log(data));
    }

    public updateCourse(putRequest: RequestInit): void {
        this.loggerApi.trace("Sending PUT request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, putRequest);
        response.then((response) => response.json()).then((data) => console.log(data));
    }

    public deleteCourse(deleteRequest: RequestInit, id: number): void {
        const url = this.url + "/" + id;
        this.loggerApi.trace("Sending DELETE request to URL: " + url);
        const response: Promise<Response> = sendRequest(this.url, deleteRequest);
        response.then((data) => console.log(data));
    }
}
