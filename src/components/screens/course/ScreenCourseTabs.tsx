import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { Header } from "../../../constants/navigators/Header";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsCourseExtended } from "../../../api/endpoints/EndpointsCourseExtended";
import { ICourse } from "../../../types/ICourse";
import { NavigationRoutes, ScreenCourseProps } from "../../../constants/navigators/NavigationRoutes";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenCourseOverview } from "./ScreenCourseOverview";
import { ScreenCourseTimeline } from "./ScreenCourseTimeline";
import { LocalizationContext } from "../../Context";

const CourseTab = createMaterialTopTabNavigator();

export const ScreenCourseTabs: React.FC = (props) => {
    const navigation = useNavigation();
    const route = useRoute();

    React.useContext(LocalizationContext);

    return (
        <CourseTab.Navigator
            tabBarOptions={{
                style: {
                    position: "absolute",
                    backgroundColor: "transparent",
                    zIndex: 100,
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 40,
                },
                tabStyle: {},
                labelStyle: {
                    color: "yellow",
                },
            }}>
            <CourseTab.Screen name="OVERVIEW" component={ScreenCourseOverview}></CourseTab.Screen>
            <CourseTab.Screen name="TIMELINE" component={ScreenCourseTimeline}></CourseTab.Screen>
        </CourseTab.Navigator>
    );
};
