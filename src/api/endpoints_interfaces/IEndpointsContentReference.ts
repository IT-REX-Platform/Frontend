import { IContent } from "../../types/IContent";

/**
 * Wrapper for endpoints in backend course-service ContentReference.java.
 */
export interface IEndpointsContentReference {
    createContentReference(postRequest: RequestInit): Promise<IContent>;
    updateContentReference(putRequest: RequestInit): Promise<IContent>;
    getContentReference(getRequest: RequestInit, id: string): Promise<IContent>;
    getContentReferences(getRequest: RequestInit): Promise<IContent[]>;
    deleteContentReference(deleteRequest: RequestInit, id: string): Promise<void>;
    patchContentReference(patchRequest: RequestInit): Promise<IContent>;
}
