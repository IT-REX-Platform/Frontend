import { IUser } from "../../types/IUser";

/**
 * Wrapper for endpoints of the backend User Info resource.
 */
export interface IEndpointsUserInfo {
    getUserInfo(getRequest: RequestInit): Promise<IUser>;
}
