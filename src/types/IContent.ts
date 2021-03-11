import { IVideo } from "./IVideo";

export type IContent = {
    id?: string;
    chapterId?: string;
    timePeriodId?: string;
    contentId?: string;
    video?: IVideo;
};
