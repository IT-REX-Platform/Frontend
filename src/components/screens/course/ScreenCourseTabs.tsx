import React from "react";
import { dark } from "../../../constants/themes/dark";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScreenCourseOverview } from "./ScreenCourseOverview";
import { ScreenCourseTimeline } from "./ScreenCourseTimeline";
import { LocalizationContext } from "../../Context";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const CourseTab = createMaterialTopTabNavigator<CourseTabParamList>();

export type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "INFO">,
    DrawerNavigationProp<RootDrawerParamList>
>;

export type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "INFO">;
export type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "INFO">;

export const ScreenCourseTabs: React.FC = () => {
    React.useContext(LocalizationContext);

    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();
    const route = useRoute<ScreenCourseTabsRouteProp>();

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
                    color: "white",
                },
            }}>
            <CourseTab.Screen name="OVERVIEW" component={ScreenCourseOverview}></CourseTab.Screen>
            <CourseTab.Screen name="TIMELINE" component={ScreenCourseTimeline}></CourseTab.Screen>
        </CourseTab.Navigator>
    );
};
