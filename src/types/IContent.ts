import { IQuiz } from "./IQuiz";
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
    //tmp
    isPersistent?: boolean;
};
