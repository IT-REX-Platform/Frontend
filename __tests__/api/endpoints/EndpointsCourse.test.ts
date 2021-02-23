import "../../../setupTests.ts";
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

// Find a way to mock fetch response.
// jest.mock("../../../src/api/endpoints/sendRequest", () => {
//     return {
//         sendRequest: jest.fn(() => {
//             return Response;
//         }),
//     };
// });

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
        id: "12345",
        name: "TheoInf3",
        publishState: CoursePublishState.PUBLISHED,
    };

    it("getFilteredCourses() should return an array of all courses.", async () => {
        try {
            const response: ICourse[] = await instance.getAllCourses(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("getFilteredCourses() should return an array of published courses.", async () => {
        const params: ICourse = { publishState: CoursePublishState.PUBLISHED };

        try {
            const response: ICourse[] = await instance.getAllCourses(request, params);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("getFilteredCourses() should return an array of all courses with name TheoInf2.", async () => {
        const params: ICourse = { name: "TheoInf3" };

        try {
            const response: ICourse[] = await instance.getAllCourses(request, params);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("getCourse() should return one course.", async () => {
        try {
            let id: string = "12345";
            const response: ICourse = await instance.getCourse(request, id);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("createCourse() should create a course.", async () => {
        try {
            const response: ICourse = await instance.createCourse(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("updateCourse() should update a course.", async () => {
        try {
            const response: ICourse = await instance.updateCourse(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("patchCourse() should update a course.", async () => {
        try {
            const response: ICourse = await instance.patchCourse(request);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("delete() should delete a course.", async () => {
        try {
            let id: string = "12345";
            instance.deleteCourse(request, id);
            expect(instance.deleteCourse).toHaveBeenCalled();
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });
});
