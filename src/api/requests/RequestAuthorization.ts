import AuthenticationService from "../../services/AuthenticationService";
import { loggerFactory } from "../../../logger/LoggerConfig";

/**
 * Class gets tokens to authorize requests to backend.
 */
export class RequestAuthorization {
    private static loggerApi = loggerFactory.getLogger("API.RequestAuthorization");

    public static createAuthorizedRequest(): RequestInit {
        const authService = AuthenticationService.getInstance();
        try {
            return {
                headers: {
                    Authorization: authService.getToken().tokenType + " " + authService.getToken().accessToken,
                },
                credentials: "include",
            };
        } catch (error) {
            this.loggerApi.error("An error occured while getting authorizarion tokens for request.", error);
            throw new Error("User must log in.");
        }
    }
}
