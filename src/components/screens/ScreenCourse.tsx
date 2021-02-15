import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { LocalizationContext } from "../../App";
import { dark } from "../../constants/themes/dark";
import { Header } from "../../constants/navigators/Header";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourseExtended } from "../../api/endpoints/EndpointsCourseExtended";
import { ICourse } from "../../types/ICourse";
import { NavigationRoutes, ScreenCourseProps } from "../../constants/navigators/NavigationRoutes";

export const ScreenCourse: React.FC = (props) => {
    const navigation = useNavigation();
    const route = useRoute();

    const courseId = route.params.courseId;

    React.useContext(LocalizationContext);

    const courseInitial: ICourse = {};
    const [course, setCourse] = useState(courseInitial);

    const endpointsCourseExtended: EndpointsCourseExtended = new EndpointsCourseExtended();

    useEffect(() => {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourseExtended.getCourse(request, courseId).then((receivedCourse) => {
            setCourse(receivedCourse);
        });
    }, [courseId]);

    return (
        <>
            <ImageBackground source={require("../../constants/images/Background_forest.svg")} style={styles.image}>
                <Header title={course.name} />
                <Text style={styles.container}>{course.name}</Text>
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
