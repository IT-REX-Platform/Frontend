import { sendRequest } from "./sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseParser } from "./ResponseParser";
import { IEndpointsUserInfo } from "../endpoints_interfaces/IEndpointsUserInfo";
import { IUser } from "../../types/IUser";

/**
 * Endpoints for the /api/user-info/.
 * Refers to the implementation of the UserInfoResource.java.
 */
export class EndpointsUserInfo implements IEndpointsUserInfo {
    private loggerApi = loggerFactory.getLogger("API.EndpointsUserInfo");
    private url: string;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_USERINFO;
    }

    /**
     * Gets the user info from its endpoint.
     *
     * @param getRequest GET request.
     * @returns a promise containing information about the requesting user.
     */
    public getUserInfo(getRequest: RequestInit): Promise<IUser> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);

        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return ResponseParser.parseUserInfo(response);
    }
}
