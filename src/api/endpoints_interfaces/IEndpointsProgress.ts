import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";

/**
 * Wrapper for endpoints in backend course-service ProgressResource.java.
 */
export interface IEndpointsProgress {
    createContentProgress(postRequest: RequestInit, courseTrackerId: string): Promise<IContentProgressTracker>;
    getContentProgress(getRequest: RequestInit, trackerId: string): Promise<IContentProgressTracker>;
    setContentStateComplete(putRequest: RequestInit, trackerId: string): Promise<IContentProgressTracker>;
    updateContentProgress(
        putRequest: RequestInit,
        trackerId: string,
        progress: number
    ): Promise<IContentProgressTracker>;
    getCourseProgress(getRequest: RequestInit, courseId: string): Promise<ICourseProgressTracker>;
    updateLastAccessedContentProgress(putRequest: RequestInit, crsTrackerId: string): Promise<IContentProgressTracker>;
}
