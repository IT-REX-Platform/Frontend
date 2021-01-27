import { TokenRequestConfig, TokenResponse, TokenResponseConfig } from "expo-auth-session";
import AuthenticationService from "../src/services/AuthenticationService";

describe("test Authentication service", () => {
    it("check if singleton returns same instance", () => {
        const authService = AuthenticationService.getInstance();

        expect(authService).not.toBeUndefined;

        const secondAuthService = AuthenticationService.getInstance();

        expect(authService).toBe(secondAuthService);
    });

    it("check if token response can be set and retrieved", () => {
        const tokenResponseConfig: TokenResponseConfig = {
            accessToken: "accessToken",
        };

        const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);

        const authService = AuthenticationService.getInstance();

        authService.setTokenResponse(tokenResponse);

        expect(authService.getToken()).toEqual(tokenResponse);
    });
});
