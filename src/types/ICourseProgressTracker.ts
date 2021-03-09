import { IContentProgressTracker } from "./IContentProgressTracker";

export type ICourseProgressTracker = {
    id?: string;
    courseId?: string;
    lastContentReference?: { empty: boolean; present: boolean };
    contentProgressTrackers?: IContentProgressTracker[];
};
