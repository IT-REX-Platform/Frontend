import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
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
        <ImageBackground source={require("../../../constants/images/Background_forest.svg")} style={styles.image}>
            <View style={styles.container}>
                <Text style={styles.header}>{course.name}</Text>
                <Text style={styles.description}>{course.courseDescription}</Text>

                <TouchableOpacity style={styles.button} onPress={() => goToVideoPool()}>
                    <Text style={styles.buttonText}>{i18n.t("itrex.videoPool")}</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );

    function goToVideoPool() {
        if (course.id !== undefined) {
            navigation.navigate("VIDEO_POOL");
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    header: {
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
    description: {
        color: "white",
        fontSize: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.pink,
        borderWidth: 1,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
});
