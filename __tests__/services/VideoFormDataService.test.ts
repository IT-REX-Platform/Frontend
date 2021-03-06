import "../../setupTests.ts";
import { VideoFormDataParams } from "../../src/constants/VideoFormDataParams";
import { buildVideoAsFormData } from "../../src/services/VideoFormDataService";

// TODO: find a way to import or mock File.
global.File = jest.fn();

describe("test video as FormData service", () => {
    const { JSDOM } = require("jsdom");
    const jsdom = new JSDOM("");

    xit("check if FormData from video is created", async () => {
        const videoFile: File = new File([], "file_name");
        const courseId = "course_ID";

        const expectedFormData = new jsdom.window.FormData();
        expectedFormData.append(VideoFormDataParams.PARAM_VIDEO_FILE, videoFile, videoFile.name);
        expectedFormData.append(VideoFormDataParams.PARAM_COURSE_ID, courseId);

        expect(buildVideoAsFormData(videoFile, courseId)).toBe(expectedFormData);
    });
});
