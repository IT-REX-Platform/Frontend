import "../../setupTests.ts";
import { TokenResponse, TokenResponseConfig } from "expo-auth-session";
import AuthenticationService from "../../src/services/AuthenticationService";

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

    it("check if roles are present", () => {
        global.atob = jest.fn().mockReturnValue("{name:'myCoolToken', roles: ['ITREX_LECTURER']}");

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return { name: "myCoolToken", roles: ["ITREX_LECTURER"] };
        });

        // btoa("{name:'myCoolToken', roles: ['ITREX_LECTURER']}")
        const myToken = "hallo." + "e25hbWU6J215Q29vbFRva2VuJywgcm9sZXM6IFsnSVRSRVhfTEVDVFVSRVInXX0=" + ".hallo";
        const tokenResponseConfig: TokenResponseConfig = {
            accessToken: myToken,
        };

        const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);
        const authService = AuthenticationService.getInstance();
        authService.setTokenResponse(tokenResponse);

        expect(authService.getRoles()).toContain("ITREX_LECTURER");
    });
});
