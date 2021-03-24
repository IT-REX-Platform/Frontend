/* eslint-disable complexity */
import { CompositeNavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, ImageBackground, StyleSheet, View } from "react-native";
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
import { TextButton } from "../../uiElements/TextButton";
import { CourseRoles } from "../../../constants/CourseRoles";
import { IUser } from "../../../types/IUser";

export type ScreenCourseOverviewNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "OVERVIEW">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

//export type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "INFO">;
//export type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "INFO">;

export const ScreenCourseInformation: React.FC = () => {
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    React.useContext(LocalizationContext);
    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
    const endpointsCourse: EndpointsCourse = new EndpointsCourse();
    const { course } = React.useContext(CourseContext);

    const [user, setUserInfo] = useState<IUser>({});

    useFocusEffect(
        React.useCallback(() => {
            AuthenticationService.getInstance().getUserInfo(setUserInfo);
        }, [])
    );

    return (
        <ImageBackground source={require("../../../constants/images/Background2.png")} style={styles.imageContainer}>
            <View style={styles.verticalSeparator}></View>
            {_checkForLeaveCourse()}
            {_getPublishSate()}
            <Text style={styles.textWhite}>{course.courseDescription}</Text>
            {_createContentAsOwner()}
        </ImageBackground>
    );

    function _getPublishSate() {
        if (course.publishState === CoursePublishState.UNPUBLISHED) {
            return (
                <>
                    {" "}
                    {_getDate(i18n.t("itrex.startDate"), course.startDate)}
                    {_getDate(i18n.t("itrex.endDate"), course.endDate)}
                    {_checkOwnerSettings()}
                </>
            );
        }

        if (course.publishState === CoursePublishState.PUBLISHED) {
            return (
                <>
                    {_getDate(i18n.t("itrex.startDate"), course.startDate)}
                    {_getDate(i18n.t("itrex.endDate"), course.endDate)}
                </>
            );
        }

        return;
    }

    function _getDate(title: string, date?: Date) {
        return (
            <View style={styles.dateContainer}>
                <Text style={[styles.textWhiteBold, styles.horizontalSeparator]}>{title}:</Text>
                <Text style={styles.textWhite}>{dateConverter(date)}</Text>
            </View>
        );
    }

    function _checkOwnerSettings() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole = user.courses[course.id];
        if (courseRole === CourseRoles.OWNER || courseRole === CourseRoles.MANAGER) {
            return (
                <View style={styles.dualButtonContainer}>
                    <TextButton title={i18n.t("itrex.publishCourse")} onPress={() => _confirmPublishCourse()} />
                    <TextButton title={i18n.t("itrex.deleteCourse")} color="pink" onPress={() => _confirmDeletion()} />
                </View>
            );
        }
    }

    function _confirmPublishCourse() {
        const publishCourse = confirm(i18n.t("itrex.confirmPublishCourse"));
        if (publishCourse === true) {
            _patchCourse();
        }
    }

    function _patchCourse() {
        loggerService.trace("Parsing ID string to ID number.");

        const coursePatch: ICourse = {
            id: course.id,
            publishState: CoursePublishState.PUBLISHED,
            startDate: course.startDate,
            endDate: course.endDate,
        };

        loggerService.trace(`Updating course: name=${course.name}, publishedState=${CoursePublishState.PUBLISHED}.`);
        const patchRequest: RequestInit = RequestFactory.createPatchRequest(coursePatch);
        endpointsCourse.patchCourse(
            patchRequest,
            i18n.t("itrex.publishCourseSuccess"),
            i18n.t("itrex.publishCourseError")
        );
    }

    function _confirmDeletion() {
        const confirmation: boolean = confirm(i18n.t("itrex.confirmDeleteCourse"));
        if (confirmation === true) {
            _deleteCourse();
        }
    }

    function _deleteCourse(): void {
        if (course.id == undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
        endpointsCourse
            .deleteCourse(
                deleteRequest,
                course.id,
                i18n.t("itrex.courseDeletedSuccessfully"),
                i18n.t("itrex.deleteCourseError")
            )
            .then(() => navigation.navigate("ROUTE_HOME"));
    }

    function _checkForLeaveCourse() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];
        return _checkForUserRole(courseRole);
    }

    function _checkForUserRole(courseRole: CourseRoles) {
        if (courseRole === CourseRoles.OWNER || courseRole == undefined) {
            // TODO: Undefined should never happen, buuuut currently does when creating a course.
            // Apparently updating the token and then navigating isn't waiting long enough.
            return <></>;
        }

        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "95%" }}>
                <TextButton color="pink" title={i18n.t("itrex.leaveCourse")} onPress={() => _leaveCourse()} />
            </View>
        );
    }

    function _leaveCourse() {
        if (course.id != undefined) {
            const request: RequestInit = RequestFactory.createPostRequestWithoutBody();
            endpointsCourse.leaveCourse(request, course.id, undefined, i18n.t("itrex.leaveCourseError")).then(() => {
                AuthenticationService.getInstance()
                    .refreshToken()
                    .then(() => navigation.navigate("ROUTE_HOME"));
            });
        }
    }

    function _createContentAsOwner() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole = user.courses[course.id];
        if (courseRole === CourseRoles.OWNER) {
            return (
                <View style={styles.dualButtonContainer}>
                    <TextButton title={i18n.t("itrex.videoPool")} onPress={() => navigation.navigate("VIDEO_POOL")} />
                    <TextButton title={i18n.t("itrex.quizPool")} onPress={() => navigation.navigate("QUIZ_POOL")} />
                </View>
            );
        }
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        alignItems: "center",
    },
    dateContainer: {
        flexDirection: "row",
    },
    textWhiteBold: {
        color: "white",
        fontWeight: "bold",
    },
    textWhite: {
        color: "white",
    },
    dualButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    verticalSeparator: {
        marginTop: 60,
    },
    horizontalSeparator: {
        marginEnd: 10,
    },
});
