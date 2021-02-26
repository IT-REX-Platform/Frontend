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

const loggerService = loggerFactory.getLogger("service.JoinCourseComponent");
const endpointsCourse: EndpointsCourse = new EndpointsCourse();

export type JoinCourseRouteProp = RouteProp<RootDrawerParamList, "ROUTE_JOIN_COURSE">;

export const JoinCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    // const route = useRoute<JoinCourseRouteProp>();

    const [courseIdString, setCourseId] = useState("");

    const initialPublishedCourseState: ICourse[] = [];
    const [coursesPublished, setCoursesPublished] = useState(initialPublishedCourseState);

    useEffect(() => getPublishedCourses(), []);

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <ScrollView>
                <View style={styles.container}>
                    <Header title={i18n.t("itrex.joinCourse")} />
                    <View style={styles.styledInputContainer}>
                        <Text style={styles.textSytle}>{i18n.t("itrex.enterCouseId")}</Text>
                        <TextInput
                            style={styles.styledTextInput}
                            onChangeText={(id: string) => setCourseId(id)}
                            testID="courseIdInput"></TextInput>
                    </View>
                    <Pressable style={styles.styledButton}>
                        <Button title={i18n.t("itrex.joinCourse")} onPress={joinCourse}></Button>
                    </Pressable>
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
        const course: ICourse = {
            id: courseIdString,
        };

        if (coursesPublished.find((val) => val.id == courseIdString) === undefined) {
            alert(i18n.t("itrex.joinCourseNoCourseError"));
            return;
        }

        const request: RequestInit = RequestFactory.createPostRequest(course);
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
    styledTextInput: {
        marginLeft: 8,
        borderColor: "lightgray",
        borderWidth: 2,
        color: "white",
        minWidth: 196,
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
    },
});
