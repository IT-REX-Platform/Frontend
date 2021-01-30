import { CoursePublishState } from "../constants/CoursePublishState";

/**
 * Parameters for filtering courses.
 */
export interface ICourseFilterParams {
    id?: number;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishState?: CoursePublishState;
    // ownership?: string;
}
