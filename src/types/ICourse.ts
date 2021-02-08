import { CoursePublishState } from "../constants/CoursePublishState";

export interface ICourse {
    id?: number;
    name?: string;
    courseDescription?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishState?: CoursePublishState;
    // ownership?: string;
}
