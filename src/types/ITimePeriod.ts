import { IChapter } from "./IChapter";

export type ITimePeriod = {
    id?: string;
    courseId?: string;
    startDate?: Date;
    endDate?: Date;
    publishState?: TimePeriodPublishState;
    contentReferenceIds?: string[];
    // Temporary
    chapters?: IChapter[];
    name?: string;
};

//???
export enum TimePeriodPublishState {
    UNPUBLISHED = "UNPUBLISHED",
    PUBLISHED = "PUBLISHED",
    NOTSTARTED = "NOTSTARTED",
}
