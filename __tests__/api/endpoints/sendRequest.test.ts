import { TokenResponse, TokenResponseConfig } from "expo-auth-session";
import AuthenticationService from "../../../src/services/AuthenticationService";
import { RequestFactory } from "../../../src/api/requests/RequestFactory";
import "isomorphic-fetch";

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

describe("sendRequest()", () => {
    xit("sends an authorized request", () => {
        let getRequest: RequestInit = RequestFactory.createGetRequest();

        // Complete once fetch can be mocked.
        // const expectedResponse;

        // expect(sendRequest("URL", getRequest)).toMatchObject(expectedResponse);
    });
});
