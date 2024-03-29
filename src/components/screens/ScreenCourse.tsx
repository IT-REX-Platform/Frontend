/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScaledSize, useWindowDimensions, View, ImageBackground } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { dark } from "../../constants/themes/dark";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import { ICourse } from "../../types/ICourse";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenCourseTabs } from "./course/ScreenCourseTabs";
import { CourseContext, LocalizationContext } from "../Context";
import { DrawerNavigationProp, DrawerScreenProps } from "@react-navigation/drawer";
import { CourseStackParamList, RootDrawerParamList } from "../../constants/navigators/NavigationRoutes";
import { VideoPoolComponent } from "../contentPoolComponents/VideoPoolComponent";
import { VideoComponent } from "../VideoComponent";
import AuthenticationService from "../../services/AuthenticationService";
import i18n from "../../locales";
import { ScreenAddChapter } from "./course/ScreenAddChapter";
import { ScreenAddQuiz } from "./quizzes/ScreenAddQuiz";
import { CourseRoles } from "../../constants/CourseRoles";
import { IUser } from "../../types/IUser";
import { ScreenChapterStudent } from "./ScreenChapterStudent";
import { ScreenAddQuestion } from "./quizzes/questions/ScreenAddQuestion";
import { QuizPoolComponent } from "../contentPoolComponents/QuizPoolComponent";
import { ScreenQuizOverview } from "./quizzes/solveQuiz/ScreenQuizOverview";
import { ScreenQuizSolve } from "./quizzes/solveQuiz/ScreenQuizSolve";
import { ScreenQuizResult } from "./quizzes/solveQuiz/ScreenQuizResult";
import { Header } from "../../constants/navigators/Header";
import { CoursePublishState } from "../../constants/CoursePublishState";
import { InfoUnpublished } from "../uiElements/InfoUnpublished";
import { InfoPublished } from "../uiElements/InfoPublished";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import ProgressService from "../../services/ProgressService";
import { MinimalScreenForDrawer } from "../../constants/MinimalScreenForDrawer";
import { getCourseInformation } from "../../services/CourseService";

export type ScreenCourseNavigationProp = DrawerNavigationProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseProps = DrawerScreenProps<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;

const CourseStack = createStackNavigator<CourseStackParamList>();

export const ScreenCourse: React.FC = () => {
    /**
     * !!! ATTENTION !!!
     * Checking route.params and courseId must be the first thing this component does (after calling useRoute(), duh).
     * This prevents crash: "Error: Rendered more hooks than during the previous render."
     */
    const route: ScreenCourseRouteProp = useRoute<ScreenCourseRouteProp>();
    if (route.params == undefined) {
        return _renderEmptyCourse();
    }
    // Yes, both checks are required.
    if (route.params.courseId == undefined || route.params.courseId == "undefined") {
        return _renderEmptyCourse();
    }
    const courseId: string | undefined = route.params.courseId;

    // Hooks.
    React.useContext(LocalizationContext);
    const navigation: ScreenCourseNavigationProp = useNavigation<ScreenCourseNavigationProp>();
    const dimensions: ScaledSize = useWindowDimensions();

    // Course data.
    const courseInitial: ICourse = {};
    const [course, setCourse] = useState(courseInitial);

    // Current course context.
    const courseContext = React.useMemo(() => ({ course, setCourse }), [course]);

    // User info.
    const [user, setUserInfo] = useState<IUser>({});
    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});

    useEffect(() => {
        setUserInfo(AuthenticationService.getInstance().getUserInfoCached());
        // AuthenticationService.getInstance().getUserInfo(setUserInfo);

        getCourseInformation(courseId).then((course) => {
            setCourse(course);
        });

        // Update the progress.
        ProgressService.getInstance().updateCourseProgressFor(courseId, (receivedProgress) => {
            console.log("Progress of course:");
            console.log(receivedProgress);
            setCourseProgress(receivedProgress);
        });
    }, [courseId]);

    return (
        <CourseContext.Provider value={courseContext}>
            <CourseStack.Navigator
                initialRouteName="INFO"
                screenOptions={{
                    // Hamburger button.
                    // headerLeft: () => showHamburger(dimensions),

                    // Back button.
                    headerTintColor: "white",
                    headerBackTitle: "Back",

                    // Title in center.
                    headerTitle: () => (
                        <Text style={styles.headerTitle}>
                            {course.name}
                            {publishSate(course.publishState)}
                        </Text>
                    ),
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: dark.theme.darkBlue1,
                        borderBottomColor: dark.theme.darkBlue2,
                        borderBottomWidth: 3,
                    },

                    // Home button.
                    // headerRight: () => (
                    //    <MaterialCommunityIcons
                    //        style={styles.icon}
                    //        name="home-outline"
                    //        size={28}
                    //        color="white"
                    //        onPress={() => navigation.navigate("ROUTE_HOME")}
                    //    />
                    //),

                    // Hamburger button.
                    headerRight: () => showHamburger(dimensions),
                }}>
                <CourseStack.Screen name="INFO" component={ScreenCourseTabs} />

                {getUploadVideoScreen()}
                {getQuizPoolScreen()}
                <CourseStack.Screen
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.chapterContent"),
                    }}
                    name="CHAPTER_CONTENT"
                    component={ScreenChapterStudent}
                />
                {getCreateChapterScreen()}
                {getQuizCreation()}
                <CourseStack.Screen
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.quizOverview"),
                    }}
                    name="QUIZ_OVERVIEW"
                    component={ScreenQuizOverview}
                />
                <CourseStack.Screen
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.workOnQuiz"),
                    }}
                    name="QUIZ_SOLVE"
                    component={ScreenQuizSolve}
                />
                <CourseStack.Screen
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.quizResults"),
                    }}
                    name="QUIZ_RESULT"
                    component={ScreenQuizResult}
                />
            </CourseStack.Navigator>
        </CourseContext.Provider>
    );

    function _renderEmptyCourse() {
        return (
            <>
                <Header title="..." />
                <ImageBackground
                    source={require("../../constants/images/Background2.png")}
                    style={styles.imageContainer}>
                    <View style={styles.infoTextBox}>
                        <Text style={styles.infoText}>{i18n.t("itrex.noCourseAccessed")}</Text>
                    </View>
                </ImageBackground>
            </>
        );
    }

    /**
     * Show the published state in the Title header, so that the lecturer can see the published state from every page of the course.
     *
     * @param isPublished information if the course is published or not
     *
     */
    function publishSate(isPublished: CoursePublishState | undefined) {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == CourseRoles.MANAGER) {
            if (isPublished === CoursePublishState.UNPUBLISHED) {
                return (
                    <View style={styles.publishedState}>
                        <InfoUnpublished />
                    </View>
                );
            } else if (isPublished === CoursePublishState.PUBLISHED) {
                return (
                    <View style={styles.publishedState}>
                        <InfoPublished />
                    </View>
                );
            }
        }

        return;
    }

    function showHamburger(dimensions: ScaledSize) {
        if (dimensions.width < MinimalScreenForDrawer.SIZE) {
            return (
                <MaterialCommunityIcons
                    style={styles.icon}
                    name="menu"
                    size={28}
                    color="white"
                    onPress={() => navigation.openDrawer()}
                />
            );
        } else {
            return null;
        }
    }

    /**
     * Give the course owner/manager of the course the ability to access the quiz pool to manage its content.
     */
    function getQuizPoolScreen() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == CourseRoles.MANAGER) {
            return (
                <CourseStack.Screen
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.quizPool"),
                    }}
                    name="QUIZ_POOL"
                    component={QuizPoolComponent}
                />
            );
        }
    }

    /**
     * Give the course owner/manager of the course the ability to access the video pool to manage its content.
     */
    function getUploadVideoScreen() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == CourseRoles.MANAGER) {
            return (
                <>
                    <CourseStack.Screen
                        options={{
                            title: i18n.t("itrex.tabTitle") + i18n.t("itrex.videoPool"),
                        }}
                        name="VIDEO_POOL"
                        component={VideoPoolComponent}
                    />
                    <CourseStack.Screen
                        options={{
                            title: i18n.t("itrex.tabTitle") + i18n.t("itrex.video"),
                        }}
                        name="VIDEO"
                        component={VideoComponent}
                    />
                </>
            );
        }
    }

    /**
     * Give the course owner/manager of the course the ability to access the quiz creation component.
     */
    function getQuizCreation() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == CourseRoles.MANAGER) {
            return (
                <>
                    <CourseStack.Screen
                        options={{
                            title: i18n.t("itrex.tabTitle") + i18n.t("itrex.createQuiz"),
                        }}
                        name="CREATE_QUIZ"
                        component={ScreenAddQuiz}
                    />
                    <CourseStack.Screen
                        options={{
                            title: i18n.t("itrex.tabTitle") + i18n.t("itrex.createQuestion"),
                        }}
                        name="CREATE_QUESTION"
                        component={ScreenAddQuestion}
                    />
                </>
            );
        }
    }

    /**
     * Give a user with the role of lecturer or admin the possibility to create a course.
     */
    function getCreateChapterScreen() {
        if (AuthenticationService.getInstance().isLecturerOrAdmin()) {
            return (
                <CourseStack.Screen
                    name="CHAPTER"
                    component={ScreenAddChapter}
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.chapterContent"),
                    }}
                />
            );
        }
    }
};

const styles = StyleSheet.create({
    icon: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 22,
        color: "white",
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        alignItems: "center",
        justifyContent: "center",
    },
    infoTextBox: {
        padding: 50,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 5,
    },
    infoText: {
        textAlign: "center",
        margin: 5,
        color: "white",
    },
    publishedState: {
        position: "absolute",
        margin: 8,
        marginTop: 4,
        marginLeft: 16,
    },
});
