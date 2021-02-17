import * as Linking from "expo-linking";
import { LinkingOptions, RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const prefix = Linking.makeUrl("it-rex://");

export const config = {
    screens: {
        ROUTE_HOME: "home",
        ROUTE_LOGIN: "login",
        ROUTE_CREATE_COURSE: "createCourse",
        ROUTE_UPLOAD_VIDEO: "uploadVideo",
        ROUTE_COURSE_DETAILS: {
            path: "course/:courseId",
            screens: {
                initialRouteName: "INFO",
                INFO: {
                    screens: {
                        TIMELINE: "TIMELINE",
                        OVERVIEW: "OVERVIEW",
                    },
                },
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
    static ROUTE_COURSE_DETAILS_TABS = "ROUTE_COURSE_DETAILS_TABS";
    static ROUTE_COURSE_DETAILS_OVERVIEW = "ROUTE_COURSE_DETAILS_OVERVIEW";
    static ROUTE_COURSE_DETAILS_TIMELINE = "ROUTE_COURSE_DETAILS_TIMELINE";

    static linking: LinkingOptions = {
        prefixes: [prefix],
        config: config,
    };
}

// TESTS
export enum NAV_SCREENS {
    ROUTE_COURSE_DETAILS = "ROUTE_COURSE_DETAILS",
}

export type DrawerParamList = {
    [NAV_SCREENS.ROUTE_COURSE_DETAILS]: { courseId: number } | undefined;
};

export type ScreenCourseProps = {
    route: RouteProp<DrawerParamList, NAV_SCREENS.ROUTE_COURSE_DETAILS>;
    navigation: DrawerNavigationProp<DrawerParamList, NAV_SCREENS.ROUTE_COURSE_DETAILS>;
};
// TESTS
