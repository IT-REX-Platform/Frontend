import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResource.java.
 */
export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit, params?: ICourse): Promise<ICourse[]>;
    getCourse(getRequest: RequestInit, id: string): Promise<ICourse>;
    createCourse(postRequest: RequestInit): Promise<ICourse>;
    updateCourse(putRequest: RequestInit): Promise<ICourse>;
    patchCourse(putRequest: RequestInit): Promise<ICourse>;
    deleteCourse(deleteRequest: RequestInit, id: string): void;
}
