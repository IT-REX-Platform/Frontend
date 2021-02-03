import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResource.java.
 */
export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit): Promise<ICourse[]>;
    getCourse(getRequest: RequestInit, id: number): Promise<ICourse>;
    createCourse(postRequest: RequestInit): Promise<ICourse>;
    updateCourse(putRequest: RequestInit): Promise<ICourse>;
    deleteCourse(deleteRequest: RequestInit, id: number): void;
}
