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

export type ScreenCourseNavigationProp = DrawerNavigationProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseProps = DrawerScreenProps<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;

const CourseStack = createStackNavigator<CourseStackParamList>();

export const ScreenCourse: React.FC = () => {
    /**
     * !!! ATTENTION !!!
     * Checking route.params and courseId must be the first thing this component does (after calling useRoute(), duh).
     * This prevents: "Error: Rendered more hooks than during the previous render."
     */
    const route: ScreenCourseRouteProp = useRoute<ScreenCourseRouteProp>();
    if (route.params == undefined) {
        return _renderEmptyCourse();
    }
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
    const courseContext = React.useMemo(
        () => ({
            course,
            setCourse,
        }),
        [course]
    );

    // User info.
    const [user, setUserInfo] = useState<IUser>({});

    const endpointsCourse: EndpointsCourse = new EndpointsCourse();
    useEffect(() => {
        AuthenticationService.getInstance().getUserInfo(setUserInfo);
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse
            .getCourse(request, courseId, undefined, i18n.t("itrex.getCourseError"))
            .then((receivedCourse) => setCourse(receivedCourse));
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
                <CourseStack.Screen name="CHAPTER_CONTENT" component={ScreenChapterStudent} />
                {getCreateChapterScreen()}
                {getQuizCreation()}
                <CourseStack.Screen name="QUIZ_OVERVIEW" component={ScreenQuizOverview} />
                <CourseStack.Screen name="QUIZ_SOLVE" component={ScreenQuizSolve} />
                <CourseStack.Screen name="QUIZ_RESULT" component={ScreenQuizResult} />
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

        if (courseRole === CourseRoles.OWNER || courseRole == undefined) {
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
        if (dimensions.width < 1280) {
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

    function getQuizPoolScreen() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == undefined) {
            return <CourseStack.Screen name="QUIZ_POOL" component={QuizPoolComponent} />;
        }
    }

    function getUploadVideoScreen() {
        if (AuthenticationService.getInstance().isLecturerOrAdmin()) {
            return (
                <>
                    <CourseStack.Screen name="VIDEO_POOL" component={VideoPoolComponent} />
                    <CourseStack.Screen name="VIDEO" component={VideoComponent} />
                </>
            );
        }
    }

    function getQuizCreation() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == undefined) {
            return (
                <>
                    <CourseStack.Screen name="CREATE_QUIZ" component={ScreenAddQuiz} />
                    <CourseStack.Screen name="CREATE_QUESTION" component={ScreenAddQuestion} />
                </>
            );
        }
    }

    function getCreateChapterScreen() {
        if (AuthenticationService.getInstance().isLecturerOrAdmin()) {
            return (
                <CourseStack.Screen
                    name="CHAPTER"
                    component={ScreenAddChapter}
                    options={{
                        title: i18n.t("itrex.toUploadVideo"),
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
    publishedState: { position: "absolute", margin: 8, marginLeft: 16 },
});
