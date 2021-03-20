import { IChapter } from "../../types/IChapter";

/**
 * Wrapper for endpoints in backend course-service ChapterResource.java.
 */
export interface IEndpointsChapter {
    getAllChapters(getRequest: RequestInit): Promise<IChapter[]>;
    getChapter(getRequest: RequestInit, chapterId: string): Promise<IChapter>;
    createChapter(postRequest: RequestInit): Promise<IChapter>;
    patchChapter(patchRequest: RequestInit): Promise<IChapter>;
    deleteChapter(deleteRequest: RequestInit, chapterId: string): Promise<void>;
}
