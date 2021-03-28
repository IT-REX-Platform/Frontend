import { ContentProgressTrackerState } from "../constants/ContentProgressTrackerState";
import { IContent } from "./IContent";

export type IContentProgressTracker = {
    id?: string;
    progress?: number;
    state?: ContentProgressTrackerState;
    contentReference?: IContent;
};
