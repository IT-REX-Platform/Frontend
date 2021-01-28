import { ICourse } from "../types/ICourse";
import { sendRequest } from "./sendRequest";

export class EndpointsCourse {
    public static getAllCourses(getRequest: RequestInit): Promise<ICourse[]> {
        return sendRequest(getRequest).then((data) => data as ICourse[]);
    }

    public static getCourse(): void {
        // TODO 1: send GET request to /courses/{id}
        // TODO 2: process GET response
    }

    public static createCourse(postRequest: RequestInit): void {
        sendRequest(postRequest).then((data) => console.log(data));
    }

    public static updateCourse(putRequest: RequestInit): void {
        sendRequest(putRequest).then((data) => console.log(data));
    }

    public static deleteCourse(): void {
        // TODO 1: send DELETE request to /courses/{id}
        // TODO 2: process DELETE response
    }
}
