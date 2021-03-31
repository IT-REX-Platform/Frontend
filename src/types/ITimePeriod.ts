import { IChapter } from "./IChapter";

export type ITimePeriod = {
    id?: string;
    courseId?: string;
    startDate?: Date;
    endDate?: Date;
    publishState?: TimePeriodPublishState;
    contentReferenceIds?: string[];
    // the following attributes we do not get from the service, but are set by the application
    chapters?: IChapter[];
    name?: string;
    fullName?: string;
};

//???
export enum TimePeriodPublishState {
    UNPUBLISHED = "UNPUBLISHED",
    PUBLISHED = "PUBLISHED",
    NOTSTARTED = "NOTSTARTED",
}
