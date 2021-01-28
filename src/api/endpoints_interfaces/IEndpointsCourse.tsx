import { ICourseParameters } from "../../types/ICourseParameters";
import { ICourse } from "../../types/ICourse";

export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit, params?: ICourseParameters): Promise<ICourse[]>;
    getCourse(): void; // TODO
    createCourse(postRequest: RequestInit): void;
    updateCourse(putRequest: RequestInit): void;
    deleteCourse(): void; // TODO
}
