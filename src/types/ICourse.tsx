import { CoursePublishState } from "../constants/CoursePublishState";

export interface ICourse {
    id?: number;
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishState?: CoursePublishState;
    // ownership?: string;
}
