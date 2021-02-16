import { TokenResponse, TokenResponseConfig } from "expo-auth-session";
import AuthenticationService from "../../../src/services/AuthenticationService";
import { RequestAuthorization } from "../../../src/api/requests/RequestAuthorization";

console.log = jest.fn();

describe("RequestAuthorization", () => {
    /**
     * Must be async to prevent warning:
     * "Cannot log after tests are done. Did you forget to wait for something async in your test?""
     */
    it("throws an error.", async () => {
        const expectedError = new Error("User must log in.");
        expect(() => {
            RequestAuthorization.createAuthorizedRequest();
        }).toThrow(expectedError);
    });

    it("authorizes a request.", () => {
        // mock AuthService
        jest.mock("../../../src/services/AuthenticationService", () => {
            return {
                getInstance: jest.fn().mockImplementation(() => {
                    return {
                        getToken: jest.fn().mockImplementation(() => {
                            return { tokenType: "tokenType", accessToken: "accessToken" };
                        }),
                    };
                }),
            };
        });

        const tokenResponseConfig: TokenResponseConfig = { accessToken: "accessToken" };
        const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);

        const authInstance = AuthenticationService.getInstance();
        authInstance.getToken = jest.fn(() => {
            return tokenResponse;
        });

        const expectedRequest: RequestInit = {
            headers: {
                Authorization: "bearer" + " " + "accessToken",
            },
            credentials: "include",
        };

        expect(RequestAuthorization.createAuthorizedRequest()).toStrictEqual(expectedRequest);
    });
});
