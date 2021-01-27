import AuthenticationService from "../services/AuthenticationService";

export class Authorization {
    public static createAuthorizedRequest(): RequestInit {
        const authService = AuthenticationService.getInstance();
        return {
            headers: {
                Authorization: authService.getToken().tokenType + " " + authService.getToken().accessToken,
            },
            credentials: "include",
        };
    }
}
