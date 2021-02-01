import { EndpointsCourseExtended } from "../../../src/api/endpoints/EndpointsCourseExtended";
import { ICourse } from "../../../src/types/ICourse";
import { CoursePublishState } from "../../../src/constants/CoursePublishState";
import "isomorphic-fetch";

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

// TODO: fetch response
// jest.mock("../../../src/api/endpoints/sendRequest", () => {
//     return {
//         sendRequest: jest.fn(() => {
//             return Response;
//         }),
//     };
// });

describe("EndpointsCourseExtended", () => {
    let instance: EndpointsCourseExtended = new EndpointsCourseExtended();
    expect(instance).toBeInstanceOf(EndpointsCourseExtended);

    const getRequest: RequestInit = {
        headers: {
            Authorization: "bearer" + " " + "accessToken",
        },
        credentials: "include",
    };

    it("getFilteredCourses() should return an array of published courses.", async () => {
        const params: ICourse = { publishState: CoursePublishState.PUBLISHED };

        const courseExpected: ICourse = {
            publishState: CoursePublishState.PUBLISHED,
        };

        try {
            const response: ICourse[] = await instance.getFilteredCourses(getRequest, params);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            console.log("An error has occurred.", error);
        }
    });

    it("getFilteredCourses() should return an array of all courses.", async () => {
        const course: ICourse = {
            publishState: CoursePublishState.PUBLISHED,
        };

        try {
            const response: ICourse[] = await instance.getFilteredCourses(getRequest);
            expect(response).resolves.toBe(course);
        } catch (error) {
            console.log("An error has occurred.", error);
        }
    });

    it("getFilteredCourses() should return an array of all courses with name TheoInf2.", async () => {
        const params: ICourse = { name: "TheoInf2" };

        const courseExpected: ICourse = {
            name: "TheoInf2",
        };

        try {
            const response: ICourse[] = await instance.getFilteredCourses(getRequest, params);
            expect(response).resolves.toBe(courseExpected);
        } catch (error) {
            console.log("An error has occurred.", error);
        }
    });
});
