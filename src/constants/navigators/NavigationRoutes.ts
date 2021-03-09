import * as Linking from "expo-linking";
import { LinkingOptions, NavigatorScreenParams } from "@react-navigation/native";
import { IVideo } from "../../types/IVideo";

const prefix = Linking.makeUrl("it-rex://");

export const config = {
    screens: {
        ROUTE_HOME: "home",
        ROUTE_LOGIN: "login",
        ROUTE_CREATE_COURSE: "createCourse",
        ROUTE_JOIN_COURSE: "joinCourse",
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
                VIDEO_POOL: "VIDEO_POOL",
                VIDEO: "VIDEO",
                CHAPTER_CREATE: "CHAPTER_CREATE",
                CHAPTER: {
                    path: "chapter/:chapterId",
                    screens: {},
                },
                CREATE_QUIZ: {
                    path: "chapter/createQuiz/:chapterId/",
                    screens: {},
                },
            },
        },
    },
};

export type RootDrawerParamList = {
    ROUTE_HOME: undefined;
    ROUTE_CREATE_COURSE: undefined;
    ROUTE_JOIN_COURSE: { courseId?: string };
    ROUTE_COURSE_DETAILS: { courseId: string; screen?: string };
};

export type CourseStackParamList = {
    INFO: NavigatorScreenParams<CourseTabParamList>;
    VIDEO_POOL: undefined;
    VIDEO: {
        video: IVideo;
    };
    CHAPTER_CREATE: undefined;
    CREATE_QUIZ: { chapterId: string | undefined };
    CHAPTER: { chapterId: string | undefined };
};

export type CourseTabParamList = {
    OVERVIEW: undefined;
    TIMELINE: undefined;
};

export class NavigationRoutes {
    static ROUTE_HOME = "ROUTE_HOME";
    static ROUTE_LOGIN = "ROUTE_LOGIN";
    static ROUTE_CREATE_COURSE = "ROUTE_CREATE_COURSE";
    static ROUTE_JOIN_COURSE = "ROUTE_JOIN_COURSE";
    static ROUTE_COURSE_DETAILS = "ROUTE_COURSE_DETAILS";
    static ROUTE_COURSE_DETAILS_TABS = "ROUTE_COURSE_DETAILS_TABS";
    static ROUTE_COURSE_DETAILS_OVERVIEW = "ROUTE_COURSE_DETAILS_OVERVIEW";
    static ROUTE_COURSE_DETAILS_TIMELINE = "ROUTE_COURSE_DETAILS_TIMELINE";
    static ROUTE_VIDEO_POOL = "ROUTE_VIDEO_POOL";
    static ROUTE_VIDEO = "ROUTE_VIDEO";
    static ROUTE_CREATE_QUIZ = "ROUTE_CREATE_QUIZ";

    static linking: LinkingOptions = {
        prefixes: [prefix],
        config: config,
    };
}
