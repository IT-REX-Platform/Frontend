import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResource.java.
 */
export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit, params?: ICourse): Promise<ICourse[]>;
    getCourse(getRequest: RequestInit, id: string): Promise<ICourse>;
    createCourse(postRequest: RequestInit): Promise<ICourse>;
    updateCourse(putRequest: RequestInit): Promise<ICourse>;
    patchCourse(patchRequest: RequestInit): Promise<ICourse>;
    deleteCourse(deleteRequest: RequestInit, id: string): Promise<Response>;
    joinCourse(postRequest: RequestInit, id: string): void;
    leaveCourse(postRequest: RequestInit, id: string): void;
}
