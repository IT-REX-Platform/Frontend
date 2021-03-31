/* eslint-disable complexity */
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { CompositeNavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
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

export const ScreenCourseInformation: React.FC = () => {
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    React.useContext(LocalizationContext);
    const loggerService = loggerFactory.getLogger("service.ScreenCourseInformation");
    const endpointsCourse: EndpointsCourse = new EndpointsCourse();
    const { course } = React.useContext(CourseContext);
    const descriptionCallback = (description: string | undefined) => {
        course.courseDescription = description;
    };

    const [user, setUserInfo] = useState<IUser>({});

    useFocusEffect(
        React.useCallback(() => {
            setUserInfo(AuthenticationService.getInstance().getUserInfoCached());
        }, [])
    );

    return (
        <ImageBackground
            source={require("../../../constants/images/Background2.png")}
            style={styles.imageContainer}
            imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "cover" }}>
            <View style={styles.dualButtonContainer}>{_checkUserSettings()}</View>
            <View style={styles.informationContent}>
                <CourseInformationTable onDescriptionChanged={descriptionCallback} />
            </View>
        </ImageBackground>
    );

    /**
     * Give the different roles of users different settings for the specific course.
     */
    function _checkUserSettings() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole = user.courses[course.id];
        if (courseRole === CourseRoles.OWNER || courseRole === CourseRoles.MANAGER) {
            if (course.publishState === CoursePublishState.UNPUBLISHED) {
                return (
                    <>
                        <View>
                            <TextButton
                                title={i18n.t("itrex.deleteCourse")}
                                color="pink"
                                onPress={() => _confirmDeletion()}
                            />
                        </View>
                        <TextButton title={i18n.t("itrex.publishCourse")} onPress={() => _confirmPublishCourse()} />

                        <View>
                            <TextButton title={i18n.t("itrex.save")} onPress={() => _updateCourse()} />
                        </View>
                    </>
                );
            } else {
                return (
                    <View>
                        <TextButton title={i18n.t("itrex.save")} onPress={() => _updateCourse()} />
                    </View>
                );
            }
        } else {
            return _checkForLeaveCourse();
        }
    }

    /**
     * Creates a server request in order to update the course description.
     */
    function _updateCourse() {
        const coursePatch: ICourse = {
            id: course.id,
            courseDescription: course.courseDescription,
        };
        const updateRequest: RequestInit = RequestFactory.createPatchRequest(coursePatch);
        endpointsCourse.patchCourse(
            updateRequest,
            i18n.t("itrex.updateCourseSuccess"),
            i18n.t("itrex.updateCourseError")
        );
    }

    /**
     * Creates a server request in order to update the published state of the course.
     */
    function _publishCourse() {
        loggerService.trace("Parsing ID string to ID number.");

        const coursePatch: ICourse = {
            id: course.id,
            publishState: CoursePublishState.PUBLISHED,
            startDate: course.startDate,
            endDate: course.endDate,
        };

        loggerService.trace(`Updating course: name=${course.name}, publishedState=${CoursePublishState.PUBLISHED}.`);
        const patchRequest: RequestInit = RequestFactory.createPatchRequest(coursePatch);
        endpointsCourse
            .patchCourse(patchRequest, i18n.t("itrex.publishCourseSuccess"), i18n.t("itrex.publishCourseError"))
            .then(() => navigation.navigate("INFO", { screen: "OVERVIEW" }));
    }

    /**
     *Confirmation before publishing a course.
     */
    function _confirmPublishCourse() {
        const publishCourse = confirm(i18n.t("itrex.confirmPublishCourse"));
        if (publishCourse === true) {
            _publishCourse();
        }
    }

    /**
     * Confirmation before deleting a course.
     */
    function _confirmDeletion() {
        const confirmation: boolean = confirm(i18n.t("itrex.confirmDeleteCourse"));
        if (confirmation === true) {
            _deleteCourse();
        }
    }

    /**
     * Creates a server request to delete a specific course
     */
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
            .then(() => {
                AuthenticationService.getInstance()
                    .refreshToken()
                    .then(() => navigation.navigate("ROUTE_HOME"));
            });
    }

    /**
     *  Give a student the possibility to leave the course.
     */
    function _checkForLeaveCourse() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];
        if (courseRole === CourseRoles.OWNER || courseRole == CourseRoles.MANAGER) {
            return <></>;
        }
        return (
            <View>
                <TextButton color="pink" title={i18n.t("itrex.leaveCourse")} onPress={() => _leaveCourse()} />
            </View>
        );
    }

    /**
     * Creates a server request to leave the specific course.
     */
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
    dualButtonContainer: {
        height: 70,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row",
        paddingRight: "20px",
        paddingLeft: "20px",
    },
});
