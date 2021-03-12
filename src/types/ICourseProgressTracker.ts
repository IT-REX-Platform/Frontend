import { IContentProgressTracker } from "./IContentProgressTracker";

export type ICourseProgressTracker = {
    id?: string;
    courseId?: string;
    lastContentReference?: IContentProgressTracker;
    contentProgressTrackers?: Record<string, IContentProgressTracker>;
};
