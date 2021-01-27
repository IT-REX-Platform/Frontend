import { ICourse } from "../types/ICourse";
import ITREXVARS from "../Constants";

export class EndpointsCourse {
    private static URL = ITREXVARS().apiUrl + "services/courseservice/api/courses";

    public static getAllCourses(getRequest: RequestInit): Promise<ICourse[]> {
        return this.sendRequest(getRequest).then((data) => data as ICourse[]);
    }

    public static getCourse(): void {
        // TODO: send GET request to /courses/{id}
    }

    public static createCourse(postRequest: RequestInit): void {
        this.sendRequest(postRequest).then((data) => console.log(data));
    }

    public static updateCourse(putRequest: RequestInit): void {
        this.sendRequest(putRequest).then((data) => console.log(data));
    }

    public static deleteCourse(): void {
        // TODO: send DELETE request to /courses/{id}
    }

    private static async sendRequest(request: RequestInit) {
        return fetch(this.URL, request).then((response) => response.json());
    }
}
