import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet, Button } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { ICourse } from "../../../types/ICourse";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { CourseContext, LocalizationContext } from "../../Context";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import i18n from "../../../locales";
import { EndpointsCourse } from "../../../api/endpoints/EndpointsCourse";
import { RequestFactory } from "../../../api/requests/RequestFactory";

export type ScreenCourseOverviewNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "OVERVIEW">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

//export type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "INFO">;
//export type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "INFO">;

const endpointsCourse: EndpointsCourse = new EndpointsCourse();

export const ScreenCourseOverview: React.FC = () => {
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);
    return (
        <>
            <ImageBackground source={require("../../../constants/images/Background_forest.svg")} style={styles.image}>
                <Text style={styles.container}>Course Overview</Text>
                <Text>{course.courseDescription}</Text>
                <Button title={i18n.t("itrex.leaveCourse")} onPress={() => leaveCourse()} />
                <Button title={i18n.t("itrex.videoPool")} onPress={() => goToVideoPool()} />
            </ImageBackground>
        </>
    );

    function goToVideoPool() {
        if (course.id !== undefined) {
            navigation.navigate("VIDEO_POOL");
        }
    }

    function leaveCourse() {
        if (course.id !== undefined) {
            const request: RequestInit = RequestFactory.createPostRequest(course);
            endpointsCourse.leaveCourse(request, course.id);

            navigation.navigate("ROUTE_HOME");
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
        marginTop: 20,
    },
});
