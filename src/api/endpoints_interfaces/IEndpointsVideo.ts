import { IVideo } from "../../types/IVideo";

/**
 * Wrapper for endpoints in backend media-service VideoResource.java.
 */
export interface IEndpointsVideo {
    getAllVideos(getRequest: RequestInit, courseId?: string): Promise<IVideo[]>;
    downloadVideo(getRequest: RequestInit, id: string): Promise<IVideo>;
    uploadVideo(postRequest: RequestInit): Promise<IVideo>;
    deleteVideo(deleteRequest: RequestInit, id: string): Promise<IVideo>; // TODO: void !!!
}
