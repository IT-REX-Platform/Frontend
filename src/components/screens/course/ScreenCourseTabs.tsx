import React from "react";
import { dark } from "../../../constants/themes/dark";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenCourseOverview } from "./ScreenCourseOverview";
import { ScreenCourseTimeline } from "./ScreenCourseTimeline";
import { LocalizationContext } from "../../Context";

const CourseTab = createMaterialTopTabNavigator();

export const ScreenCourseTabs: React.FC = () => {
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
                    color: dark.theme.lightGreen,
                },
            }}>
            <CourseTab.Screen name="OVERVIEW" component={ScreenCourseOverview}></CourseTab.Screen>
            <CourseTab.Screen name="TIMELINE" component={ScreenCourseTimeline}></CourseTab.Screen>
        </CourseTab.Navigator>
    );
};
