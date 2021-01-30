import { TokenResponse, TokenResponseConfig } from "expo-auth-session";
import { Course, createPostRequest, createRequest } from "../src/api/createPostRequest";
import AuthenticationService from "../src/services/AuthenticationService";
import { mocked } from "ts-jest/utils";

const tokenResponseConfig: TokenResponseConfig = { accessToken: "accessToken" };
const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);

// mock AuthService
jest.mock("../src/services/AuthenticationService", () => {
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

const authInstance = AuthenticationService.getInstance();

authInstance.getToken = jest.fn(() => {
    return tokenResponse;
});

global.alert = jest.fn();

describe("create POST request", () => {
    // const mockedAuthSrv = mocked("../src/services/AuthenticationService", true);

    it("check if generic post works", () => {
        const expectedRequest: RequestInit = {
            headers: {
                Authorization: "tokenType" + " " + "accessToken",
            },
            credentials: "include",
        };

        expect(createRequest()).toMatchObject(expectedRequest);
    });

    it("check if post works for course object", () => {
        const courseObject: Course = {
            name: "testCourse",
            description: "testDescription",
            endDate: new Date(),
            maxFoodSum: 420,
            startDate: new Date(),
        };

        const expectedRequest: RequestInit = {
            headers: {
                Authorization: "tokenType" + " " + "accessToken",
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify(courseObject),
        };

        expect(createPostRequest(courseObject)).toMatchObject(expectedRequest);
    });
});
