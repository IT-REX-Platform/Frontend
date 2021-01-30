import { NavigationRoutes } from "../src/constants/NavigationRoutes";

test("Checks values of navigation routes.", () => {
    expect(NavigationRoutes.ROUTE_HOME).toBe("Home");
    expect(NavigationRoutes.ROUTE_LOGIN).toBe("Login");
    expect(NavigationRoutes.ROUTE_CREATE_COURSE).toBe("CreateCourse");
    expect(NavigationRoutes.ROUTE_UPLOAD_VIDEO).toBe("UploadVideo");
    expect(NavigationRoutes.ROUTE_TEST).toBe("Test");
});
