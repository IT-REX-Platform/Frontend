import * as Linking from "expo-linking";
import { LinkingOptions, NavigatorScreenParams } from "@react-navigation/native";
import { IVideo } from "../../types/IVideo";
import { IQuiz } from "../../types/IQuiz";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { IChapter } from "../../types/IChapter";

const prefix = Linking.makeUrl("it-rex://");

/**
 * Linking config for parsing the url
 */
export const config = {
    screens: {
        ROUTE_HOME: "home",
        ROUTE_LOGIN: "login",
        ROUTE_LOGOUT: "logout",
        ROUTE_CREATE_COURSE: "createCourse",
        ROUTE_JOIN_COURSE: "joinCourse",
        ROUTE_COURSE_DETAILS: {
            path: "course/:courseId",
            screens: {
                initialRouteName: "INFO",
                INFO: {
                    screens: {
                        COURSE_INFROMATION: "COURSE_INFROMATION",
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
                CHAPTER_CONTENT: {
                    path: "chapter/:chapterId/content",
                    screens: {},
                },
                QUIZ_POOL: "QUIZ_POOL",
                CREATE_QUIZ: "CREATE_QUIZ",
                CREATE_QUESTION: {
                    path: "chapter/createQuiz/createQuestion/:chapterId",
                    screens: {},
                },
                QUIZ_OVERVIEW: "QUIZ_OVERVIEW",
                QUIZ_RESULT: "QUIZ_RESULT",
                QUIZ_SOLVE: "QUIZ_SOLVE",
            },
        },
    },
};

/**
 * "Pages" and parameters of the RootDrawer
 */
export type RootDrawerParamList = {
    ROUTE_HOME: undefined;
    ROUTE_CREATE_COURSE: undefined;
    ROUTE_JOIN_COURSE: { courseId?: string };
    ROUTE_COURSE_DETAILS: { courseId: string; screen?: string };
};

/**
 * "Pages" and parameters of the CourseStack
 */
export type CourseStackParamList = {
    INFO: NavigatorScreenParams<CourseTabParamList>;
    VIDEO_POOL: undefined;
    VIDEO: {
        video: IVideo;
    };
    CHAPTER_CREATE: undefined;
    QUIZ_POOL: undefined;

    CREATE_QUIZ: {
        chapter?: IChapter;
        courseId?: string;
        chapterId?: string;
        questionId?: string;
        quiz?: IQuiz;
        quizId?: string;
    };
    CREATE_QUESTION: {
        quiz?: IQuiz;
        courseId?: string;
        question?: IQuestionMultipleChoice | IQuestionNumeric | IQuestionSingleChoice;
    };
    QUIZ_OVERVIEW: {
        quiz: IQuiz;
    };
    QUIZ_RESULT: {
        quiz: IQuiz;
        chapterId: string;
    };
    QUIZ_SOLVE: {
        quiz: IQuiz;
        chapterId: string;
    };
    CHAPTER: {
        chapterId: string | undefined;
    };
    CHAPTER_CONTENT: { chapterId: string };
};

export type CourseTabParamList = {
    OVERVIEW: undefined;
    COURSE_INFROMATION: undefined;
};

export class NavigationRoutes {
    static ROUTE_HOME = "ROUTE_HOME";
    static ROUTE_LOGIN = "ROUTE_LOGIN";
    static ROUTE_CREATE_COURSE = "ROUTE_CREATE_COURSE";
    static ROUTE_JOIN_COURSE = "ROUTE_JOIN_COURSE";
    static ROUTE_COURSE_DETAILS = "ROUTE_COURSE_DETAILS";
    static ROUTE_COURSE_DETAILS_TABS = "ROUTE_COURSE_DETAILS_TABS";
    static ROUTE_COURSE_DETAILS_OVERVIEW = "ROUTE_COURSE_DETAILS_OVERVIEW";
    static ROUTE_COURSE_DETAILS_COURSE_INFROMATION = "ROUTE_COURSE_DETAILS_COURSE_INFROMATION";
    static ROUTE_VIDEO_POOL = "ROUTE_VIDEO_POOL";
    static ROUTE_VIDEO = "ROUTE_VIDEO";
    static ROUTE_QUIZ_POOL = "ROUTE_QUIZ_POOL";
    static ROUTE_CREATE_QUIZ = "ROUTE_CREATE_QUIZ";
    static ROUTE_CREATE_QUESTION = "ROUTE_CREATE_QUESTION";
    static ROUTE_CHAPTER_CONTENT = "ROUTE_CHAPTER_CONTENT";
    static ROUTE_QUIZ_OVERVIEW = "ROUTE_QUIZ_OVERVIEW";
    static ROUTE_QUIZ_SOLVE = "ROUTE_QUIZ_SOLVE";
    static ROUTE_QUIZ_RESULT = "ROUTE_QUIZ_RESULT";

    static linking: LinkingOptions = {
        prefixes: [prefix],
        config: config,
    };
}
