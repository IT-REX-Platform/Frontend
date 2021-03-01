import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet, Button, View } from "react-native";
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
        <View style={styles.rootContainer}>
            <ImageBackground
                source={require("../../../constants/images/Background3.png")}
                style={styles.image}
                imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "contain" }}>
                <View style={styles.editMode}>
                    <Text>{course.courseDescription}</Text>
                    <Button title={i18n.t("itrex.videoPool")} onPress={() => goToVideoPool()} />
                </View>
            </ImageBackground>
        </View>
    );

    function goToVideoPool() {
        if (course.id !== undefined) {
            navigation.navigate("VIDEO_POOL");
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
    rootContainer: {
        paddingTop: "3%",
        flex: 4,
        flexDirection: "column",
        backgroundColor: dark.theme.darkBlue1,
    },
    editMode: {
        paddingTop: "20px",
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
