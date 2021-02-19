import { IVideo } from "../../types/IVideo";

/**
 * Wrapper for endpoints in backend media-service VideoResource.java.
 */
export interface IEndpointsVideo {
    getVideoById(getRequest: RequestInit, id: number): Promise<IVideo>;
    uploadVideo(postRequest: RequestInit): Promise<IVideo>;
    deleteVideoById(deleteRequest: RequestInit, id: number): Promise<IVideo>;
}
