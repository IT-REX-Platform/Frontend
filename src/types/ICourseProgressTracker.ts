import { IContent } from "./IContent";
import { IContentProgressTracker } from "./IContentProgressTracker";

export type ICourseProgressTracker = {
    id?: string;
    courseId?: string;
    lastContentReference?: IContent;
    contentProgressTrackers?: Record<string, IContentProgressTracker>;
};
