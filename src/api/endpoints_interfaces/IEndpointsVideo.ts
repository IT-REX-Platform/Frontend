import { IVideo } from "../../types/IVideo";

/**
 * Wrapper for endpoints in backend media-service VideoResource.java.
 */
export interface IEndpointsVideo {
    findAllVideosOfACourse(getRequest: RequestInit, courseId: string): Promise<IVideo[]>;
    downloadVideo(getRequest: RequestInit, videoId: string): Promise<IVideo>;
    findAllWithIds(postRequest: RequestInit): Promise<Map<string, IVideo>>;
    uploadVideo(postRequest: RequestInit): Promise<IVideo>;
    patchVideo(patchRequest: RequestInit): Promise<IVideo>;
    deleteVideo(deleteRequest: RequestInit, videoId: string): Promise<void>;
}
