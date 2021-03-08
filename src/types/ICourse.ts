import { CoursePublishState } from "../constants/CoursePublishState";
import { IChapter } from "./IChapter";

export type ICourse = {
    id?: string;
    name?: string;
    courseDescription?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
    publishState?: CoursePublishState;
    activeOnly?: boolean;
    chapters?: string[];
    chapterObjects?: IChapter[];
};
