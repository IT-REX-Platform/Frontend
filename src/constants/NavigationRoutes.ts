import * as Linking from "expo-linking";

const prefix = Linking.makeUrl();

const config = {
    screens: {
        ROUTE_HOME: "home",
        ROUTE_LOGIN: "login",
        ROUTE_CREATE_COURSE: "createCourse",
        ROUTE_UPLOAD_VIDEO: "uploadVideo",
        ROUTE_COURSE_DETAILS: {
            path: "courseDetails/:name",
            parse: {
                name: (name: string) => `${name}`,
            },
            stringify: {
                name: (name: string) => name.replaceAll(" ", ""),
            },
        },
    },
};
export class NavigationRoutes {
    static ROUTE_HOME = "ROUTE_HOME";
    static ROUTE_LOGIN = "ROUTE_LOGIN";
    static ROUTE_CREATE_COURSE = "ROUTE_CREATE_COURSE";
    static ROUTE_UPLOAD_VIDEO = "ROUTE_UPLOAD_VIDEO";
    static ROUTE_COURSE_DETAILS = "ROUTE_COURSE_DETAILS";

    static linking = {
        prefixes: [prefix],
        config,
    };
}
