import { ApiUrls } from "../src/constants/ApiUrls";

test("Checks values API URLs.", () => {
    expect(ApiUrls.URL_COURSES).toBe("services/courseservice/api/courses");
    expect(ApiUrls.URL_COURSES_EXTENDED).toBe("services/courseservice/api/courses/extended");
});
