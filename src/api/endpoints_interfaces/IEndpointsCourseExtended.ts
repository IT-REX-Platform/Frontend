import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResourceExtended.java.
 */
export interface IEndpointsCourseExtended {
    getFilteredCourses(getRequest: RequestInit, params?: ICourse): Promise<ICourse[]>;
    getCourse(getRequest: RequestInit, id: number): Promise<ICourse>;
    createCourse(postRequest: RequestInit): Promise<ICourse>;
    updateCourse(putRequest: RequestInit): Promise<ICourse>;
    patchCourse(putRequest: RequestInit): Promise<ICourse>;
    deleteCourse(deleteRequest: RequestInit, id: number): void;
}
