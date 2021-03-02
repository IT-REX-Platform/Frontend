import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { dark } from "../../../constants/themes/dark";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { LocalizationContext } from "../../Context";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "TIMELINE">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();

    React.useContext(LocalizationContext);

    return (
        <>
            <ImageBackground source={require("../../../constants/images/Background_forest.svg")} style={styles.image}>
                <Text style={styles.container}>Course Timeline</Text>
            </ImageBackground>
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
        marginTop: 20,
    },
});
