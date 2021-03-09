import { IChapter } from "../../types/IChapter";

/**
 * Wrapper for endpoints in backend course-service ChapterResource.java.
 */
export interface IEndpointsProgress {
    createContentProgress(postRequest: RequestInit): Promise<IChapter>;
    getCourseProgress(getRequest: RequestInit, courseId: string): Promise<IChapter[]>;
    setContentStateComplete(putRequest: RequestInit, trackerId: string): Promise<IChapter>;
    updateContentProgress(putRequest: RequestInit, trackerId: string): Promise<IChapter>;
    getContentProgress(getRequest: RequestInit, trackerId: string): Promise<IChapter>;
}
