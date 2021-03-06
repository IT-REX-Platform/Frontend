/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScaledSize, useWindowDimensions } from "react-native";
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
import { VideoPoolComponent } from "../videoPoolComponent/VideoPoolComponent";
import { VideoComponent } from "../VideoComponent";
import AuthenticationService from "../../services/AuthenticationService";
import i18n from "../../locales";
import { ScreenAddChapter } from "./course/ScreenAddChapter";
import { ScreenAddQuiz } from "./quizzes/ScreenAddQuiz";
import { CourseRoles } from "../../constants/CourseRoles";
import { IUser } from "../../types/IUser";
import { ScreenChapterStudent } from "./ScreenChapterStudent";
import { ScreenAddQuestion } from "./quizzes/questions/ScreenAddQuestion";

export type ScreenCourseNavigationProp = DrawerNavigationProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseProps = DrawerScreenProps<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;

const CourseStack = createStackNavigator<CourseStackParamList>();

export const ScreenCourse: React.FC = () => {
    const navigation: ScreenCourseNavigationProp = useNavigation<ScreenCourseNavigationProp>();
    const route: ScreenCourseRouteProp = useRoute<ScreenCourseRouteProp>();
    const dimensions: ScaledSize = useWindowDimensions();

    const courseId = route.params.courseId;

    React.useContext(LocalizationContext);

    const courseInitial: ICourse = {};
    const [course, setCourse] = useState(courseInitial);
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
        <CourseContext.Provider value={course}>
            <CourseStack.Navigator
                initialRouteName="INFO"
                screenOptions={{
                    // Hamburder button.
                    // headerLeft: () => (
                    //    showHamburger(dimensions)
                    // ),

                    // Back button.
                    headerTintColor: "white",
                    headerBackTitle: "Back",

                    // Title in center.
                    headerTitle: () => <Text style={styles.headerTitle}>{course.name}</Text>,
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

                    // Hamburder button.
                    headerRight: () => showHamburger(dimensions),
                }}>
                <CourseStack.Screen name="INFO" component={ScreenCourseTabs}></CourseStack.Screen>

                {getUploadVideoScreen()}
                <CourseStack.Screen name="CHAPTER_CONTENT" component={ScreenChapterStudent}></CourseStack.Screen>
                {getCreateChapterScreen()}
                {getQuizCreation()}
            </CourseStack.Navigator>
        </CourseContext.Provider>
    );

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

    function getUploadVideoScreen() {
        if (AuthenticationService.getInstance().isLecturerOrAdmin()) {
            return (
                <>
                    <CourseStack.Screen name="VIDEO_POOL" component={VideoPoolComponent}></CourseStack.Screen>
                    <CourseStack.Screen name="VIDEO" component={VideoComponent}></CourseStack.Screen>
                </>
            );
        }
    }

    function getQuizCreation() {
        if (user.courses === undefined || course.id === undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole === undefined) {
            return (
                <>
                    <CourseStack.Screen name="CREATE_QUIZ" component={ScreenAddQuiz}></CourseStack.Screen>
                    <CourseStack.Screen name="CREATE_QUESTION" component={ScreenAddQuestion}></CourseStack.Screen>
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
});
