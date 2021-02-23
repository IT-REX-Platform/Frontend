import "../../setupTests.ts";
import { ApiUrls } from "../../src/constants/ApiUrls";
import { itRexVars } from "../../src/constants/Constants";
import { createVideoUrl } from "../../src/services/createVideoUrl";

jest.mock("../../src/constants/Constants", () => {
    const mockFunctionOutput = {
        apiUrl: "http://localhost:8080/",
        authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
        authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
        channel: "dev",
    };

    return {
        itRexVars: jest.fn(() => {
            return mockFunctionOutput;
        }),
    };
});

describe("test video URL creator", () => {
    it("check if a correct video URL is created", () => {
        const videoId = "some_video_ID";
        const expectedUrl: string = itRexVars().apiUrl + ApiUrls.URL_VIDEOS + "/" + videoId;
        expect(createVideoUrl(videoId)).toBe(expectedUrl);
    });
});
