import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet, Button, View, Pressable } from "react-native";
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
import { dateConverter } from "../../../helperScripts/validateCourseDates";
import { CoursePublishState } from "../../../constants/CoursePublishState";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../../api/endpoints/EndpointsCourse";
import { loggerFactory } from "../../../../logger/LoggerConfig";
import AuthenticationService from "../../../services/AuthenticationService";
import { ITREXRoles } from "../../../constants/ITREXRoles";

export type ScreenCourseOverviewNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "OVERVIEW">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

//export type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "INFO">;
//export type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "INFO">;

export const ScreenCourseOverview: React.FC = () => {
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    React.useContext(LocalizationContext);
    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
    const endpointsCourse: EndpointsCourse = new EndpointsCourse();
    const course: ICourse = React.useContext(CourseContext);

    return (
        <View style={styles.rootContainer}>
            <ImageBackground source={require("../../../constants/images/Background2.png")} style={styles.image}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.content}>{getPublishedSate(course.publishState)}</View>
                        <Text style={styles.textWhite}>{course.courseDescription}</Text>
                        {uploadViedeoAsOwner()}
                    </View>
                </View>
            </ImageBackground>
        </View>
    );

    function getDate(showDate: Date | undefined, title: string) {
        return (
            <Text style={{ color: "white" }}>
                <Text style={{ fontWeight: "bold" }}>{title}</Text>
                <Text>{dateConverter(showDate)}</Text>
            </Text>
        );
    }

    function uploadViedeoAsOwner() {
        if (
            AuthenticationService.getInstance().getRoles().includes("ROLE_ITREX_LECTURER") ||
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
        ) {
            return (
                <View style={[{ width: "20%", marginTop: 15 }]}>
                    <Button
                        color={dark.Opacity.blueGreen}
                        title={i18n.t("itrex.videoPool")}
                        onPress={() => goToVideoPool()}
                    />
                </View>
            );
        }
    }

    //TODO: Check if user is owner, when the course/role list is available
    function checkOwnerSettings() {
        if (
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
        ) {
            return (
                <View style={{ flexDirection: "row" }}>
                    <Pressable style={styles.styledButton}>
                        <Button
                            color={dark.Opacity.blueGreen}
                            title={i18n.t("itrex.publishCourse")}
                            onPress={() => patchCourse(course)}></Button>
                    </Pressable>
                    <Pressable style={styles.styledButton}>
                        <Button
                            color={dark.Opacity.pink}
                            title={i18n.t("itrex.deleteCourse")}
                            onPress={() => deleteCourse(course)}></Button>
                    </Pressable>
                </View>
            );
        }
    }

    function getPublishedSate(isPublished: string | undefined) {
        if (isPublished === "UNPUBLISHED") {
            return (
                <>
                    <View style={styles.unpublishedCard}>
                        <View style={styles.circleUnpublished} />
                        <Text style={styles.textUnpublished}>{i18n.t("itrex.unpublished")}</Text>
                    </View>
                    <Text>{getDate(course.startDate, i18n.t("itrex.startDate"))}</Text>
                    <Text>{getDate(course.endDate, i18n.t("itrex.endDate"))}</Text>
                    {checkOwnerSettings()}
                </>
            );
        } else if (isPublished === "PUBLISHED") {
            return (
                <>
                    <View style={styles.publishedCard}>
                        <View style={styles.circlePublished} />
                        <Text style={styles.textPublished}>{i18n.t("itrex.published")}</Text>
                    </View>
                    <Text>{getDate(course.startDate, i18n.t("itrex.startDate") + ": ")}</Text>
                    <Text>{getDate(course.endDate, i18n.t("itrex.endDate") + ": ")}</Text>
                </>
            );
        }

        return;
    }

    function patchCourse(courses: ICourse) {
        loggerService.trace("Parsing ID string to ID number");

        // ATTENTION: fields without values will be overwritten with null in DB. @s.pastuchov 27.01.21
        const course: ICourse = {
            id: courses.id,
            publishState: CoursePublishState.PUBLISHED,
            startDate: courses.startDate,
            endDate: courses.endDate,
        };

        loggerService.trace(`Updating course: name=${courses.name}, publishedState=${CoursePublishState.PUBLISHED}.`);
        const putRequest: RequestInit = RequestFactory.createPatchRequest(course);
        endpointsCourse.patchCourse(putRequest).then((data) => console.log(data));
    }

    function deleteCourse(courses: ICourse): void {
        if (courses.id === undefined) {
            return;
        }

        const request: RequestInit = RequestFactory.createDeleteRequest();
        endpointsCourse.deleteCourse(request, courses.id);
    }

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
        color: "white",
        fontWeight: "bold",
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
    content: {
        flex: 1,
        margin: 15,
        color: "white",
        alignItems: "center",
    },
    textWhite: {
        color: "white",
    },
    styledButton: {
        margin: 5,
    },
    unpublishedCard: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderColor: dark.theme.pink,
        borderWidth: 2,
        textShadowColor: dark.theme.pink,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
    },
    textUnpublished: {
        color: dark.theme.pink,
        fontSize: 10,
    },
    circleUnpublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.pink,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.pink,
        marginRight: 3,
    },
    publishedCard: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderColor: dark.theme.lightGreen,
        borderWidth: 2,
        textShadowColor: dark.theme.lightGreen,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
    },
    textPublished: {
        color: dark.theme.lightGreen,
        fontSize: 10,
    },
    circlePublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightGreen,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightGreen,
        marginRight: 5,
    },
    input: {
        borderRadius: 20,
        minHeight: 40,
        maxHeight: 200,
        margin: 20,
        padding: 20,
        borderWidth: 1,
    },
});
