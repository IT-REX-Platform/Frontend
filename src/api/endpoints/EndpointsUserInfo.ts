import { sendRequest } from "../requests/sendRequest";
import { itRexVars } from "../../constants/Constants";
import { ApiUrls } from "../../constants/ApiUrls";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { IEndpointsUserInfo } from "../endpoints_interfaces/IEndpointsUserInfo";
import { IUser } from "../../types/IUser";
import { ResponseParserUserInfo } from "../responses/ResponseParserUserInfo";
import { Logger } from "typescript-logging";

/**
 * Endpoints for the /api/user-info/.
 * Refers to the implementation of the UserInfoResource.java.
 */
export class EndpointsUserInfo implements IEndpointsUserInfo {
    private loggerApi: Logger;
    private url: string;
    private responseParserUserInfo: ResponseParserUserInfo;

    public constructor() {
        this.loggerApi = loggerFactory.getLogger("API.EndpointsUserInfo");
        this.url = itRexVars().apiUrl + ApiUrls.URL_USERINFO;
        this.responseParserUserInfo = new ResponseParserUserInfo();
    }

    /**
     * Gets the user info from its endpoint.
     *
     * @param getRequest GET request.
     * @param successMsg A success message.
     * @param errorMsg An error message.
     * @returns a promise containing information about the requesting user.
     */
    public getUserInfo(getRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IUser> {
        this.loggerApi.trace("Sending GET request to URL: " + this.url);
        const response: Promise<Response> = sendRequest(this.url, getRequest);
        return this.responseParserUserInfo.parseUserInfo(response, successMsg, errorMsg);
    }
}
