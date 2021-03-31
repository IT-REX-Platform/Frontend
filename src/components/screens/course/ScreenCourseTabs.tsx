import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenCourseInformation } from "./ScreenCourseInformation";
import { ScreenCourseTimeline } from "./ScreenCourseTimeline";
import { LocalizationContext } from "../../Context";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import i18n from "../../../locales";

const CourseTab = createMaterialTopTabNavigator<CourseTabParamList>();

export type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "INFO">,
    DrawerNavigationProp<RootDrawerParamList>
>;

export type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "INFO">;
export type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "INFO">;

export const ScreenCourseTabs: React.FC = () => {
    React.useContext(LocalizationContext);

    return (
        <CourseTab.Navigator
            tabBarOptions={{
                style: {
                    position: "absolute",
                    backgroundColor: "#071C45",
                    zIndex: 100,
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 40,
                },
                indicatorStyle: {
                    backgroundColor: "#0D2B56",
                    height: "80%",
                    width: "45%",
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: "white",
                    marginLeft: 30,
                },
                tabStyle: {},
                labelStyle: {
                    color: "white",
                    fontSize: 15,
                },
            }}>
            <CourseTab.Screen
                name="OVERVIEW"
                component={ScreenCourseTimeline}
                options={{
                    title: i18n.t("itrex.tabTitle") + i18n.t("itrex.chapterOverview"),
                    tabBarLabel: i18n.t("itrex.overview"),
                }}
            />
            <CourseTab.Screen
                name="COURSE_INFROMATION"
                component={ScreenCourseInformation}
                options={{
                    title: i18n.t("itrex.tabTitle") + i18n.t("itrex.courseInformation"),
                    tabBarLabel: i18n.t("itrex.courseInformation"),
                }}
            />
        </CourseTab.Navigator>
    );
};
