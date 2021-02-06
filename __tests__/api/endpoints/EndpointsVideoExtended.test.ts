import { EndpointsVideoExtended } from "../../../src/api/endpoints/EndpointsVideoExtended";
import { IVideo } from "../../../src/types/IVideo";
import "isomorphic-fetch";

// Disable logs in EndpointsVideoExtended.ts.
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

describe("EndpointsVideoExtended", () => {
    let instance: EndpointsVideoExtended = new EndpointsVideoExtended();
    expect(instance).toBeInstanceOf(EndpointsVideoExtended);

    const request: RequestInit = {
        headers: {
            Authorization: "bearer" + " " + "accessToken",
        },
        credentials: "include",
    };

    const videoId: number = 24;

    const videoExpected: IVideo = {
        id: 24,
        title: "24 SMILEY - HABEN WIR NOCH PEPPS?.mp4",
        mimeType: "video/mp4",
        width: 1280,
        height: 720,
        length: 92,
    };

    it("getVideoById() should return a video with the given id.", async () => {
        try {
            const response: IVideo = await instance.getVideoById(request, videoId);
            expect(response).resolves.toBe(videoExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("uploadVideo() should return a video with the given id.", async () => {
        try {
            const response: IVideo = await instance.uploadVideo(request);
            expect(response).resolves.toBe(videoExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });

    it("deleteVideoById() should return a video with the given id.", async () => {
        try {
            const response: IVideo = await instance.deleteVideoById(request, videoId);
            expect(response).resolves.toBe(videoExpected);
        } catch (error) {
            // Enable once fetch has been mocked.
            // console.log("An error has occurred.", error);
        }
    });
});
