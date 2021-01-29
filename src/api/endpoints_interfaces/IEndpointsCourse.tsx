import { ICourse } from "../../types/ICourse";

export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit): Promise<ICourse[]>;
    getCourse(): void; // TODO
    createCourse(postRequest: RequestInit): void;
    updateCourse(putRequest: RequestInit): void;
    deleteCourse(deleteRequest: RequestInit, id: number): void;
}
