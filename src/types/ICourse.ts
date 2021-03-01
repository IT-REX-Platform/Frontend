import { CoursePublishState } from "../constants/CoursePublishState";

export type ICourse = {
    id?: string;
    name?: string;
    courseDescription?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishState?: CoursePublishState;
};
