import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View } from "react-native";
import { dark } from "../../constants/themes/dark";
import { Header } from "../../constants/navigators/Header";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import { ICourse } from "../../types/ICourse";
import { NavigationRoutes, ScreenCourseProps } from "../../constants/navigators/NavigationRoutes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenCourseOverview } from "./course/ScreenCourseOverview";
import { ScreenCourseTimeline } from "./course/ScreenCourseTimeline";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../locales";

import { createStackNavigator } from "@react-navigation/stack";
import { ScreenCourseTabs } from "./course/ScreenCourseTabs";
import { CourseContext, LocalizationContext } from "../Context";

const CourseStack = createStackNavigator();

//courseTabOverview: "Overview",
//courseTabTimeline: "Timeline",
export const ScreenCourse: React.FC = (props) => {
    const navigation = useNavigation();
    const route = useRoute();

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
        <>
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
                                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_HOME)}
                            />
                        ),
                        headerLeft: () => (
                            <MaterialCommunityIcons
                                name="menu"
                                color="white"
                                size={28}
                                onPress={() => navigation.openDrawer()}
                                style={styles.icon}
                            />
                        ),
                    }}>
                    <CourseStack.Screen name="INFO" component={ScreenCourseTabs}></CourseStack.Screen>
                </CourseStack.Navigator>
            </CourseContext.Provider>
        </>
    );
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
