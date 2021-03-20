import { IContent } from "../../types/IContent";

/**
 * Wrapper for endpoints in backend course-service ContentReference.java.
 */
export interface IEndpointsContentReference {
    getAllContentReferences(getRequest: RequestInit): Promise<IContent[]>;
    getContentReference(getRequest: RequestInit, contentReferenceId: string): Promise<IContent>;
    createContentReference(postRequest: RequestInit): Promise<IContent>;
    patchContentReference(patchRequest: RequestInit): Promise<IContent>;
    deleteContentReference(deleteRequest: RequestInit, contentReferenceId: string): Promise<void>;
}
