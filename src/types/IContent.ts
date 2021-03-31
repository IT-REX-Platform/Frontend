import { IQuiz } from "./IQuiz";
import { ITimePeriod } from "./ITimePeriod";
import { IVideo } from "./IVideo";

export enum CONTENTREFERENCETYPE {
    QUIZ = "QUIZ",
    VIDEO = "VIDEO",
}

export type IContent = {
    id?: string;
    chapterId?: string;
    timePeriodId?: string;
    contentId?: string;
    video?: IVideo;
    quiz?: IQuiz;
    contentReferenceType?: CONTENTREFERENCETYPE;
    // the following attributes we do not get from the service, but are set by the application
    isPersistent?: boolean;
    timePeriod?: ITimePeriod;
};
