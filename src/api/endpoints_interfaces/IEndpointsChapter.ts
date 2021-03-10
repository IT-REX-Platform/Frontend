import { IChapter } from "../../types/IChapter";

/**
 * Wrapper for endpoints in backend course-service ChapterResource.java.
 */
export interface IEndpointsChapter {
    createChapter(postRequest: RequestInit): Promise<IChapter>;
    updateChapter(putRequest: RequestInit): Promise<IChapter>;
    getChapter(getRequest: RequestInit, id: string): Promise<IChapter>;
    getChapters(getRequest: RequestInit): Promise<IChapter[]>;
    deleteChapter(deleteRequest: RequestInit, id: string): Promise<void>;
    patchChapter(patchRequest: RequestInit): Promise<IChapter>;
}
