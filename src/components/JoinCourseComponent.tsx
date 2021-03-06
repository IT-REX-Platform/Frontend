import React, { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { Button, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ICourse } from "../types/ICourse";
import i18n from "../locales";
import { RequestFactory } from "../api/requests/RequestFactory";
import { loggerFactory } from "../../logger/LoggerConfig";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Header } from "../constants/navigators/Header";
import { LocalizationContext } from "./Context";
import { NavigationRoutes, RootDrawerParamList } from "../constants/navigators/NavigationRoutes";
import { CoursePublishState } from "../constants/CoursePublishState";
import { IUser } from "../types/IUser";
import AuthenticationService from "../services/AuthenticationService";
import { TextButton } from "./testUiElements/TextButton";

const loggerService = loggerFactory.getLogger("service.JoinCourseComponent");

export type JoinCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_JOIN_COURSE">;

export const JoinCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    // const route = useRoute<JoinCourseRouteProp>();

    const [courseIdString, setCourseId] = useState("");

    const initialPublishedCourseState: ICourse[] = [];
    const [coursesPublished, setCoursesPublished] = useState(initialPublishedCourseState);
    useEffect(() => getPublishedCourses(), []);

    const [user, setUserInfo] = useState<IUser>({});
    useEffect(() => {
        AuthenticationService.getInstance().getUserInfo(setUserInfo);
    }, []);

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <ScrollView>
                <View style={styles.container}>
                    <Header title={i18n.t("itrex.joinCourse")} />
                    <View style={[styles.styledInputContainer, styles.separator]}>
                        <Text style={styles.textSytle}>{i18n.t("itrex.enterCouseId")}</Text>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <TextInput
                            style={styles.styledTextInput}
                            onChangeText={(id: string) => setCourseId(id)}
                            testID="courseIdInput"></TextInput>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <View style={[{ width: "20%", margin: 5 }]}>
                            <TextButton
                                title={i18n.t("itrex.joinCourse")}
                                size={"small"}
                                onPress={joinCourse}></TextButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );

    function getPublishedCourses(): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse
            .getAllCourses(request, { publishState: CoursePublishState.PUBLISHED })
            .then((receivedCoursesPublished) => {
                setCoursesPublished(receivedCoursesPublished);
            });
    }

    function joinCourse(): void {
        // Check for the course to join being published/available.
        if (coursesPublished.find((val) => val.id == courseIdString) === undefined) {
            alert(i18n.t("itrex.joinCourseNoCourseError"));
            return;
        }

        // Check whether the user already joined the course.
        if (user.courses !== undefined && user.courses[courseIdString] !== undefined) {
            alert(i18n.t("itrex.joinCourseAlreadyMember"));

            navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
                courseId: courseIdString,
            });
            return;
        }

        // Do the request stuff.
        const request: RequestInit = RequestFactory.createPostRequestWithoutBody();
        endpointsCourse.joinCourse(request, courseIdString);

        navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
            courseId: courseIdString,
        });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    pageContainer: {
        marginTop: 70,
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    styledInputContainer: {
        margin: 5,
        flexDirection: "row",
        justifyContent: "center",
    },
    separator: {
        marginTop: 20,
    },
    styledTextInput: {
        borderColor: "lightgray",
        borderWidth: 2,
        color: "white",
        minWidth: 384,
        borderRadius: 5,
        height: 30,
    },
    styledButton: {
        margin: 5,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    textSytle: {
        color: "white",
        fontSize: 18,
    },
});
