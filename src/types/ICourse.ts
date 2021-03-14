import { CoursePublishState } from "../constants/CoursePublishState";
import { IChapter } from "./IChapter";
import { ITimePeriod } from "./ITimePeriod";

export type ICourse = {
    id?: string;
    name?: string;
    courseDescription?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishState?: CoursePublishState;
    activeOnly?: boolean;
    chapters?: IChapter[];
    timePeriods?: ITimePeriod[];
    remainActiveOffset?: number;
};
