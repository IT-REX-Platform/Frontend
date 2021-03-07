import { IChapter } from "./IChapter";

export type ITimePeriod = {
    id?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    chapterObjects?: IChapter[];
    publishState?: TimePeriodPublishState;
};

//???
export enum TimePeriodPublishState {
    UNPUBLISHED = "UNPUBLISHED",
    PUBLISHED = "PUBLISHED",
    NOTSTARTED = "NOTSTARTED",
}
