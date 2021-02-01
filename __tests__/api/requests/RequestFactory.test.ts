import { RequestFactory } from "../../../src/api/requests/RequestFactory";
import AuthenticationService from "../../../src/services/AuthenticationService";
import { TokenResponse, TokenResponseConfig } from "expo-auth-session";
import { ICourse } from "../../../src/types/ICourse";

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

describe("RequestFactory", () => {
    it("createGetRequest() should generate an authorized GET request for getAllCourses endpoint.", () => {
        const expectedGetRequest: RequestInit = {
            headers: {
                Authorization: "tokenType" + " " + "accessToken",
            },
            method: "GET",
            credentials: "include",
        };

        const actualGetRequest: RequestInit = RequestFactory.createGetRequest();

        expect(actualGetRequest).toMatchObject(expectedGetRequest);
    });

    it("createPostRequest() should generate an authorized POST request for createCourse endpoint.", () => {
        const course: ICourse = {
            name: "test_course",
            description: "test_description",
            endDate: new Date(),
            maxFoodSum: 420,
            startDate: new Date(),
        };

        const expectedPostRequest: RequestInit = {
            headers: {
                Authorization: "tokenType" + " " + "accessToken",
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify(course),
        };

        const actualPostRequest: RequestInit = RequestFactory.createPostRequest(course);

        expect(actualPostRequest).toMatchObject(expectedPostRequest);
    });

    it("createPutRequest() should generate an authorized PUT request for updateCourse endpoint.", () => {
        const course: ICourse = {
            name: "test_course",
            description: "test_description",
            endDate: new Date(),
            maxFoodSum: 420,
            startDate: new Date(),
        };

        const expectedPutRequest: RequestInit = {
            headers: {
                Authorization: "tokenType" + " " + "accessToken",
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "PUT",
            body: JSON.stringify(course),
        };

        const actualPutRequest: RequestInit = RequestFactory.createPutRequest(course);

        expect(actualPutRequest).toMatchObject(expectedPutRequest);
    });

    it("createDeleteRequest() should generate an authorized DELETE request for deleteCourse endpoint.", () => {
        const expectedDeleteRequest: RequestInit = {
            headers: {
                Authorization: "tokenType" + " " + "accessToken",
            },
            method: "DELETE",
            credentials: "include",
        };

        const actualDeleteRequest: RequestInit = RequestFactory.createDeleteRequest();

        expect(actualDeleteRequest).toMatchObject(expectedDeleteRequest);
    });
});
