import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, Button } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { Header } from "../../../constants/navigators/Header";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../../api/endpoints/EndpointsCourse";
import { ICourse } from "../../../types/ICourse";
import {
    CourseStackParamList,
    CourseTabParamList,
    NavigationRoutes,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { CourseContext, LocalizationContext } from "../../Context";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import i18n from "../../../locales";

export type ScreenCourseOverviewNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "OVERVIEW">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

//export type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "INFO">;
//export type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "INFO">;

export const ScreenCourseOverview: React.FC = () => {
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);
    return (
        <>
            <ImageBackground source={require("../../../constants/images/Background_forest.svg")} style={styles.image}>
                <Text style={styles.container}>Course Overview</Text>
                <Text>{course.courseDescription}</Text>
                <Button
                    title={i18n.t("itrex.videoPool")}
                    onPress={() =>
                        navigation.navigate("ROUTE_COURSE_DETAILS", {
                            params: { courseId: course.id },
                            screen: NavigationRoutes.ROUTE_VIDEO_POOL,
                        })
                    }
                />
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
