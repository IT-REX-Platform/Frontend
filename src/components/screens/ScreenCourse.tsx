import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
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
import { VideoPoolComponent } from "../VideoPoolComponent";
import { VideoComponent } from "../VideoComponent";
import AuthenticationService from "../../services/AuthenticationService";
import { ITREXRoles } from "../../constants/ITREXRoles";
import i18n from "../../locales";
import { VideoUploadComponent } from "../VideoUploadComponent";

export type ScreenCourseNavigationProp = DrawerNavigationProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;
export type ScreenCourseProps = DrawerScreenProps<RootDrawerParamList, "ROUTE_COURSE_DETAILS">;

const CourseStack = createStackNavigator<CourseStackParamList>();

export const ScreenCourse: React.FC = () => {
    const navigation = useNavigation<ScreenCourseNavigationProp>();
    const route = useRoute<ScreenCourseRouteProp>();

    const courseId = route.params.courseId;

    React.useContext(LocalizationContext);

    const courseInitial: ICourse = {};
    const [course, setCourse] = useState(courseInitial);

    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    useEffect(() => {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse.getCourse(request, courseId).then((receivedCourse) => {
            setCourse(receivedCourse);
        });
    }, [courseId]);

    return (
        <CourseContext.Provider value={course}>
            <CourseStack.Navigator
                initialRouteName="INFO"
                screenOptions={{
                    headerTitle: () => <Text style={styles.headerTitle}>{course.name}</Text>,
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: dark.theme.darkBlue1,
                        borderBottomWidth: 3,
                        borderBottomColor: dark.theme.darkBlue2,
                        borderLeftColor: dark.theme.darkBlue2,
                    },
                    headerTintColor: "white",
                    headerBackTitle: "Back",
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            size={28}
                            color="white"
                            style={styles.icon}
                            onPress={() => navigation.navigate("ROUTE_HOME")}
                        />
                    ),
                    // headerLeft: () => (
                    //     <MaterialCommunityIcons
                    //         name="menu"
                    //         color="white"
                    //         size={28}
                    //         onPress={() => navigation.openDrawer()}
                    //         style={styles.icon}
                    //     />
                    // ),
                }}>
                <CourseStack.Screen name="INFO" component={ScreenCourseTabs}></CourseStack.Screen>

                {getUploadVideoScreen()}
            </CourseStack.Navigator>
        </CourseContext.Provider>
    );

    function getUploadVideoScreen() {
        if (
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
        ) {
            return (
                <>
                    <CourseStack.Screen
                        name="VIDEO_UPLOAD"
                        component={VideoUploadComponent}
                        options={{
                            title: i18n.t("itrex.toUploadVideo"),
                        }}
                    />
                    <CourseStack.Screen name="VIDEO_POOL" component={VideoPoolComponent}></CourseStack.Screen>
                    <CourseStack.Screen name="VIDEO" component={VideoComponent}></CourseStack.Screen>
                </>
            );
        }
    }
};

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        textDecorationColor: dark.theme.pink,
        fontSize: 50,
        color: dark.theme.pink,
        justifyContent: "center",
        textAlign: "center",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    icon: {
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerTitle: {
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
        fontSize: 22,
        color: "white",
    },
});
