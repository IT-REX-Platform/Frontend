import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View } from "react-native";
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
import { TextButton } from "../../uiElements/TextButton";
import { CourseRoles } from "../../../constants/CourseRoles";
import { IUser } from "../../../types/IUser";
import { toast } from "react-toastify";
import { InfoPublished } from "../../uiElements/InfoPublished";
import { InfoUnpublished } from "../../uiElements/InfoUnpublished";

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

    const [user, setUserInfo] = useState<IUser>({});
    useEffect(() => {
        AuthenticationService.getInstance().getUserInfo(setUserInfo);
    }, []);

    return (
        <View style={styles.rootContainer}>
            <ImageBackground source={require("../../../constants/images/Background2.png")} style={styles.image}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        {getPublishedSate(course.publishState)}

                        {checkForLeaveCourse()}

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
                <Text style={{ fontWeight: "bold", marginEnd: 10 }}>{title}</Text>
                {dateConverter(showDate)}
            </Text>
        );
    }

    function checkForLeaveCourse() {
        if (user.courses === undefined || course.id === undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];
        return checkForUserRole(courseRole);
    }

    function checkForUserRole(courseRole: CourseRoles) {
        if (courseRole === CourseRoles.OWNER || courseRole === undefined) {
            // TODO: Undefined should never happen, buuuut currently does when creating a course.
            // Apparently updating the token and then navigating isn't waiting long enough.
            return <></>;
        }

        return (
            <View style={[{ width: "20%", marginTop: 15 }]}>
                <TextButton color="pink" title={i18n.t("itrex.leaveCourse")} onPress={() => leaveCourse()} />
            </View>
        );
    }

    function uploadViedeoAsOwner() {
        if (
            AuthenticationService.getInstance().getRoles().includes("ROLE_ITREX_LECTURER") ||
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
        ) {
            return <TextButton title={i18n.t("itrex.videoPool")} onPress={() => goToVideoPool()} />;
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
                    <TextButton title={i18n.t("itrex.publishCourse")} onPress={() => patchCourse(course)} />
                    <TextButton
                        title={i18n.t("itrex.deleteCourse")}
                        color="pink"
                        onPress={() => deleteCourse(course)}
                    />
                </View>
            );
        }
    }

    function getPublishedSate(isPublished: string | undefined) {
        if (isPublished === "UNPUBLISHED") {
            return (
                <>
                    <InfoUnpublished />
                    <Text>{getDate(course.startDate, i18n.t("itrex.startDate"))}</Text>
                    <Text>{getDate(course.endDate, i18n.t("itrex.endDate"))}</Text>
                    {checkOwnerSettings()}
                </>
            );
        } else if (isPublished === "PUBLISHED") {
            return (
                <>
                    <InfoPublished />
                    <Text>{getDate(course.startDate, i18n.t("itrex.startDate") + ": ")}</Text>
                    <Text>{getDate(course.endDate, i18n.t("itrex.endDate") + ": ")}</Text>
                </>
            );
        }

        return;
    }

    function patchCourse(courses: ICourse) {
        loggerService.trace("Parsing ID string to ID number");

        const course: ICourse = {
            id: courses.id,
            publishState: CoursePublishState.PUBLISHED,
            startDate: courses.startDate,
            endDate: courses.endDate,
        };

        loggerService.trace(`Updating course: name=${courses.name}, publishedState=${CoursePublishState.PUBLISHED}.`);
        const putRequest: RequestInit = RequestFactory.createPatchRequest(course);
        endpointsCourse
            .patchCourse(putRequest)
            .then((data) => {
                console.log(data);
                toast.success(i18n.t("itrex.publishedSuccessfully"));
            })
            .catch(() => toast.error(i18n.t("itrex.publishedError")));
    }

    function deleteCourse(courses: ICourse): void {
        if (courses.id === undefined) {
            return;
        }

        const request: RequestInit = RequestFactory.createDeleteRequest();
        endpointsCourse
            .deleteCourse(request, courses.id)
            .then(() => {
                toast.success(i18n.t("itrex.courseDeletedSuccessfully"));
            })
            .catch(() => {
                toast.error(i18n.t("itrex.courseDeletedError"));
            });
    }

    function goToVideoPool() {
        if (course.id !== undefined) {
            navigation.navigate("VIDEO_POOL");
        }
    }

    function leaveCourse() {
        if (course.id !== undefined) {
            const request: RequestInit = RequestFactory.createPostRequestWithoutBody();
            endpointsCourse.leaveCourse(request, course.id).then(() => {
                AuthenticationService.getInstance()
                    .refreshToken()
                    .then(() => {
                        navigation.navigate("ROUTE_HOME");
                    });
            });
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
    image: {
        flex: 1,
        resizeMode: "stretch",
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
});
