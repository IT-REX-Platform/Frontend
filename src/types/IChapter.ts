import { IContent } from "./IContent";

export type IChapter = {
    id?: string;
    title?: string;
    startDate?: Date;
    endDate?: Date;
    courseId?: string;
    contents?: string[];
    contentObjects?: IContent[];
};
