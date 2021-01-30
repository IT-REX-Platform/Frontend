import { CourseUrlParams } from "../src/constants/CourseUrlParams";

test("Checks value of course URL parameter PUBLISH_STATE.", () => {
    expect(CourseUrlParams.PUBLISH_STATE).toBe("publishState");
});
