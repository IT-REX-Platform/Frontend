import { ContentProgressTrackerState } from "../constants/ContentProgressTrackerState";
import { IContentReference } from "./IContentReference";

export type IContentProgressTracker = {
    id?: string;
    progress?: number;
    state?: ContentProgressTrackerState;
    contentReference?: IContentReference;
};
