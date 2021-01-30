import { ICourseFilterParams } from "../../types/ICourseFilterParams";
import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResourceExtended.java.
 */
export interface IEndpointsCourseExtended {
    getFilteredCourses(getRequest: RequestInit, params?: ICourseFilterParams): Promise<ICourse[]>;
}
