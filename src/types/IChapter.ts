import { IContent } from "./IContent";

export type IChapter = {
    id?: string;
    name?: string;
    courseId?: string;
    contentReferences?: IContent[];
};
