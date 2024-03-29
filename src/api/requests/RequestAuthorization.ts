import AuthenticationService from "../../services/AuthenticationService";
import { loggerFactory } from "../../../logger/LoggerConfig";

/**
 * Class gets tokens to authorize requests to backend.
 */
export class RequestAuthorization {
    public static createAuthorizedRequest(): RequestInit {
        const loggerApi = loggerFactory.getLogger("API.RequestAuthorization");

        const authService = AuthenticationService.getInstance();
        try {
            return {
                headers: {
                    Authorization: authService.getToken().tokenType + " " + authService.getToken().accessToken,
                },
                credentials: "include",
            };
        } catch (error) {
            loggerApi.error("An error has occurred while getting authorizarion tokens for request: " + error.message);
            throw new Error("User must log in.");
        }
    }
}
