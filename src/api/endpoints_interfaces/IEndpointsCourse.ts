import { CoursePublishState } from "../../constants/CoursePublishState";
import { ICourse } from "../../types/ICourse";

/**
 * Wrapper for endpoints in backend course-service CourseResource.java.
 */
export interface IEndpointsCourse {
    getAllCourses(getRequest: RequestInit, publishState?: CoursePublishState, activeOnly?: boolean): Promise<ICourse[]>;
    getUserCourses(
        getRequest: RequestInit,
        publishState?: CoursePublishState,
        activeOnly?: boolean
    ): Promise<ICourse[]>;
    getAllPublishedCourses(getRequest: RequestInit, activeOnly?: boolean): Promise<ICourse[]>;
    getCourse(getRequest: RequestInit, courseId: string): Promise<ICourse>;
    createCourse(postRequest: RequestInit): Promise<ICourse>;
    joinCourse(postRequest: RequestInit, courseId: string): Promise<void>;
    leaveCourse(postRequest: RequestInit, courseId: string): Promise<void>;
    patchCourse(patchRequest: RequestInit): Promise<ICourse>;
    deleteCourse(deleteRequest: RequestInit, courseId: string): Promise<void>;
}
