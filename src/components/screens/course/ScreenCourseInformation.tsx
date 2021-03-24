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
import { dark } from "../../../constants/themes/dark";
import { CourseInformationTable } from "../../CourseInformationTable";

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
            <View style={styles.dualButtonContainer}>{_checkUserSettings()}</View>
            <View style={styles.informationContent}>
                <CourseInformationTable />
            </View>
        </ImageBackground>
    );

    function _checkUserSettings() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole = user.courses[course.id];
        if (courseRole === CourseRoles.OWNER || courseRole === CourseRoles.MANAGER) {
            if (course.publishState === CoursePublishState.UNPUBLISHED) {
                return (
                    <>
                        <TextButton title={i18n.t("itrex.publishCourse")} onPress={() => _confirmPublishCourse()} />
                        <TextButton
                            title={i18n.t("itrex.deleteCourse")}
                            color="pink"
                            onPress={() => _confirmDeletion()}
                        />
                    </>
                );
            }
        } else {
            return _checkForLeaveCourse();
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
        console.log(courseRole);
        if (courseRole === CourseRoles.OWNER || courseRole == undefined) {
            // TODO: Undefined should never happen, buuuut currently does when creating a course.
            // Apparently updating the token and then navigating isn't waiting long enough.
            return <></>;
        }
        return (
            <View>
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
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        paddingTop: "3%",
        backgroundColor: dark.theme.darkBlue1,
    },
    informationContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    textWhite: {
        color: "white",
    },
    dualButtonContainer: {
        height: 70,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row",
        paddingRight: "20px",
        paddingLeft: "20px",
    },
});
