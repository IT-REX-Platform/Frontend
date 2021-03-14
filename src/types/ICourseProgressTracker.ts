import { IContent } from "./IContent";

export type ICourseProgressTracker = {
    id?: string;
    courseId?: string;
    lastContentReference?: IContent;
    contentProgressTrackers?: Record<string, IContent>;
};
