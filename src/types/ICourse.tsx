import { CoursePublishStates } from "../constants/CoursePublishStates";

export interface ICourse {
    id?: number;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishedState?: CoursePublishStates;
}
