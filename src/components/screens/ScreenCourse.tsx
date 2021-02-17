import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View } from "react-native";
import { dark } from "../../constants/themes/dark";
import { Header } from "../../constants/navigators/Header";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourseExtended } from "../../api/endpoints/EndpointsCourseExtended";
import { ICourse } from "../../types/ICourse";
import { NavigationRoutes, ScreenCourseProps } from "../../constants/navigators/NavigationRoutes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenCourseOverview } from "./course/ScreenCourseOverview";
import { ScreenCourseTimeline } from "./course/ScreenCourseTimeline";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../../locales";

import { createStackNavigator } from "@react-navigation/stack";
import { ScreenCourseTabs } from "./course/ScreenCourseTabs";
import { LocalizationContext } from "../Context";

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

    const endpointsCourseExtended: EndpointsCourseExtended = new EndpointsCourseExtended();

    useEffect(() => {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourseExtended.getCourse(request, courseId).then((receivedCourse) => {
            setCourse(receivedCourse);
        });
    }, [courseId]);

    return (
        <>
            <CourseStack.Navigator
                initialRouteName="info"
                screenOptions={{
                    headerTitle: () => <Text>{course.name}</Text>,
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: dark.theme.blueGreen,
                    },
                    headerTintColor: dark.theme.darkBlue1,
                    headerBackTitle: "Back",
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name="home-outline"
                            size={28}
                            color="#011B45"
                            style={styles.icon}
                            onPress={() => navigation.navigate(NavigationRoutes.ROUTE_HOME)}
                        />
                    ),
                    headerLeft: () => (
                        <MaterialCommunityIcons
                            name="menu"
                            color="#011B45"
                            size={28}
                            onPress={() => navigation.openDrawer()}
                            style={styles.icon}
                        />
                    ),
                }}>
                <CourseStack.Screen name="INFO" component={ScreenCourseTabs}></CourseStack.Screen>
            </CourseStack.Navigator>
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
});
