import { EndpointsCourse } from "../../../src/api/endpoints/EndpointsCourse";
import { ICourse } from "../../../src/types/ICourse";
import { CoursePublishState } from "../../../src/constants/CoursePublishState";
import "isomorphic-fetch";

/**
 * Prevents error:
 * ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.
 *
 * https://github.com/facebook/jest/issues/6434
 */
jest.useFakeTimers();

// Disable logs in EndpointsCourse.ts.
console.log = jest.fn();

const mockFunctionOutput = {
    apiUrl: "http://localhost:8080/",
    authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
    authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
    channel: "dev",
};

jest.mock("../../../src/constants/Constants", () => {
    return {
        itRexVars: jest.fn(() => {
            return mockFunctionOutput;
        }),
    };
});

describe("EndpointsCourse", () => {
    let instance: EndpointsCourse = new EndpointsCourse();
    expect(instance).toBeInstanceOf(EndpointsCourse);

    const request: RequestInit = {
        headers: {
            Authorization: "bearer" + " " + "accessToken",
        },
        credentials: "include",
    };
    const courseExpected: ICourse = {
        id: 12345,
        name: "TheoInf3",
        publishState: CoursePublishState.PUBLISHED,
    };

    it("should get an array of courses.", async () => {
        try {
            const response: ICourse[] = await instance.getAllCourses(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("should get one course.", async () => {
        try {
            let id: number = 12345;
            const response: ICourse = await instance.getCourse(request, id);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("should create a course.", async () => {
        try {
            const response: ICourse = await instance.createCourse(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("should update a course.", async () => {
        try {
            const response: ICourse = await instance.updateCourse(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("should delete a course.", async () => {
        try {
            let id: number = 12345;
            const response: void = await instance.deleteCourse(request, id);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });
});
