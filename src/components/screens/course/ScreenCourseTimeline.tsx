import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { Header } from "../../../constants/navigators/Header";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../../api/endpoints/EndpointsCourse";
import { ICourse } from "../../../types/ICourse";
import { NavigationRoutes, ScreenCourseProps } from "../../../constants/navigators/NavigationRoutes";
import { LocalizationContext } from "../../Context";

export const ScreenCourseTimeline: React.FC = (props) => {
    const navigation = useNavigation();
    const route = useRoute();

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
