import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResource.java.
 */
export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit): Promise<ICourse[]>;
    getCourse(getRequest: RequestInit, id: number): void;
    createCourse(postRequest: RequestInit): void;
    updateCourse(putRequest: RequestInit): void;
    deleteCourse(deleteRequest: RequestInit, id: number): void;
}
