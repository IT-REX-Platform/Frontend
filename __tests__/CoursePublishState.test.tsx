import { CoursePublishState } from "../src/constants/CoursePublishState";

test("Checks values of course publish states.", () => {
    expect(CoursePublishState.UNPUBLISHED).toBe("UNPUBLISHED");
    expect(CoursePublishState.PUBLISHED).toBe("PUBLISHED");
});
