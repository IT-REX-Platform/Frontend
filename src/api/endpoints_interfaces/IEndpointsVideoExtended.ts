import { IVideo } from "../../types/IVideo";

/**
 * Wrapper for endpoints in backend media-service VideoResourceExtended.java.
 */
export interface IEndpointsVideoExtended {
    getVideoById(getRequest: RequestInit, id: string): Promise<IVideo[]>;
    uploadVideo(postRequest: RequestInit): Promise<IVideo[]>;
    deleteVideoById(deleteRequest: RequestInit, id: string): Promise<IVideo[]>;
}
