import "../../setupTests.ts";
import { calculateVideoSize } from "../../src/services/calculateVideoSize";

describe("test video size calculator", () => {
    it("check handling of undefined video size", () => {
        const videoSizeBytes = undefined;
        const expectedSize = "-";

        expect(calculateVideoSize(videoSizeBytes)).toBe(expectedSize);
    });

    it("check handling of 0 video size", () => {
        const videoSizeBytes = 0;
        const expectedSize = "0 Bytes";

        expect(calculateVideoSize(videoSizeBytes)).toBe(expectedSize);
    });

    it("check if a correct video size is calculated", () => {
        const videoSizeBytes = 106174929;
        const expectedSize = "101.26 MB";

        expect(calculateVideoSize(videoSizeBytes)).toBe(expectedSize);
    });

    it("check handling of negative decimals input", () => {
        const videoSizeBytes = 106174929;
        const expectedSize = "101 MB";
        const negativeDecimals = -5;

        expect(calculateVideoSize(videoSizeBytes, negativeDecimals)).toBe(expectedSize);
    });
});
