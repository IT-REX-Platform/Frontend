import React, { useEffect } from "react";
import { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, View } from "react-native";
import { ICourse } from "../types/ICourse";
import i18n from "../locales";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { CommonActions, RouteProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { Header } from "../constants/navigators/Header";
import { LocalizationContext } from "./Context";
import { NavigationRoutes, RootDrawerParamList } from "../constants/navigators/NavigationRoutes";
import { CoursePublishState } from "../constants/CoursePublishState";
import { IUser } from "../types/IUser";
import AuthenticationService from "../services/AuthenticationService";
import { TextButton } from "./uiElements/TextButton";

export type JoinCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_JOIN_COURSE">;

export const JoinCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    const [courseId, setCourseId] = useState("");

    const initialPublishedCourseState: ICourse[] = [];
    const [coursesPublished, setCoursesPublished] = useState(initialPublishedCourseState);
    useEffect(() => getPublishedCourses(), []);

    const [user, setUserInfo] = useState<IUser>({});
    useEffect(() => {
        setUserInfo(AuthenticationService.getInstance().getUserInfoCached());
    }, []);

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            AuthenticationService.getInstance()
                .refreshToken()
                .then(() => {
                    setUserInfo(AuthenticationService.getInstance().getUserInfoCached());
                });
        }
    }, [isFocused]);

    return (
        <>
            <Header title={i18n.t("itrex.joinCourseTitle")} />
            <ImageBackground source={require("../constants/images/Background2.png")} style={styles.imageContainer}>
                <View style={styles.container}>
                    <View style={{ marginTop: 70 }} />

                    <Text style={styles.textStyle}>{i18n.t("itrex.enterCouseId")}</Text>
                    <TextInput
                        style={[styles.textInput, styles.separator]}
                        value={courseId}
                        onChangeText={(id: string) => setCourseId(id)}
                        testID="courseIdInput"
                    />

                    <TextButton title={i18n.t("itrex.joinCourse")} onPress={joinCourse}></TextButton>
                </View>
            </ImageBackground>
        </>
    );

    function getPublishedCourses(): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse
            .getAllCourses(request, CoursePublishState.PUBLISHED, undefined, undefined, i18n.t("itrex.getCoursesError"))
            .then((receivedCoursesPublished) => setCoursesPublished(receivedCoursesPublished));
    }

    function joinCourse(): void {
        // Check for the course to join being published/available.
        if (coursesPublished.find((val) => val.id == courseId) === undefined) {
            alert(i18n.t("itrex.joinCourseNoCourseError"));
            return;
        }

        // Check whether the user already joined the course.
        if (user.courses !== undefined && user.courses[courseId] !== undefined) {
            alert(i18n.t("itrex.joinCourseAlreadyMember"));

            navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
                courseId: courseId,
            });
            return;
        }

        // Do the request stuff.
        const request: RequestInit = RequestFactory.createPostRequestWithoutBody();
        endpointsCourse.joinCourse(request, courseId, undefined, i18n.t("itrex.joinCourseError")).then(() => {
            AuthenticationService.getInstance()
                .refreshToken()
                .then(() =>
                    navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
                        courseId: courseId,
                        screen: "OVERVIEW",
                    })
                );
        });
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
    },
    container: {
        alignItems: "center",
    },
    textStyle: {
        color: "white",
        fontSize: 18,
    },
    textInput: {
        width: "50%",
        margin: 5,
        padding: 5,
        fontSize: 16,
        color: "white",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 5,
    },
    separator: {
        marginBottom: 20,
    },
});
