/* eslint-disable complexity */
/* eslint-disable no-empty */
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ICourse } from "../../types/ICourse";
import { dark } from "../../constants/themes/dark";
import { dateConverter } from "../../helperScripts/validateCourseDates";
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import { useFocusEffect, CommonActions, useNavigation } from "@react-navigation/native";
import i18n from "../../locales";
import { CoursePublishState } from "../../constants/CoursePublishState";
import { InfoUnpublished } from "../uiElements/InfoUnpublished";
import { InfoPublished } from "../uiElements/InfoPublished";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { TextButton } from "../uiElements/TextButton";
import ProgressService from "../../services/ProgressService";
import AuthenticationService from "../../services/AuthenticationService";
import { IUser } from "../../types/IUser";
import { CourseRoles } from "../../constants/CourseRoles";

interface CourseCardProps {
    course: ICourse;
}

interface CourseProgressInfo {
    total: number;
    totalMax: number;
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
    const { course } = props;
    const navigation = useNavigation();

    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});
    const [courseProgressInfo, setCourseProgressInfo] = useState<CourseProgressInfo>({ total: 0, totalMax: 0 });
    const [user, setUserInfo] = useState<IUser>({});

    useFocusEffect(
        React.useCallback(() => {
            AuthenticationService.getInstance().getUserInfo(setUserInfo);
            if (course.id === undefined) {
                return;
            }

            ProgressService.getInstance().getCourseProgressInfo(course.id, (receivedProgress, numberProgress) => {
                setCourseProgress(receivedProgress);
                setCourseProgressInfo(numberProgress);
            });
        }, [AuthenticationService.getInstance().tokenResponse])
    );

    function getPublishedSate(isPublished: CoursePublishState | undefined) {
        if (isPublished === CoursePublishState.UNPUBLISHED) {
            return (
                <View style={styles.publishedState}>
                    <InfoUnpublished />
                </View>
            );
        } else if (isPublished === CoursePublishState.PUBLISHED) {
            return (
                <View style={styles.publishedState}>
                    <InfoPublished />
                </View>
            );
        }

        return;
    }

    function getDate(showDate: Date | undefined, title: string) {
        if (dateConverter(showDate) === "") {
            return <View style={styles.cardContent} />;
        }
        return (
            <Text style={styles.cardContent}>
                <Text style={{ fontWeight: "bold", marginEnd: 10 }}>{title}</Text>
                {dateConverter(showDate)}
            </Text>
        );
    }

    function getNavToLastContent() {
        if (user.courses !== undefined && course.id !== undefined) {
            if (user.courses[course.id] === CourseRoles.PARTICIPANT) {
                if (courseProgress.lastContentReference == null) {
                    return <></>;
                }

                return (
                    <View style={styles.cardContent}>
                        <TextButton
                            title={i18n.t("itrex.courseContinue")}
                            size="large"
                            onPress={() => {
                                // Navigate to the content page.
                                navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
                                    screen: "CHAPTER_CONTENT",
                                    params: {
                                        courseId: course.id,
                                        chapterId: courseProgress.lastContentReference?.chapterId,
                                    },
                                });
                            }}
                        />
                    </View>
                );
            }
        }
    }

    function getProgressInfo() {
        if (user.courses !== undefined && course.id !== undefined) {
            if (user.courses[course.id] === CourseRoles.PARTICIPANT) {
                const progressPercent = Math.floor((courseProgressInfo.total / courseProgressInfo.totalMax) * 100);
                if (isNaN(progressPercent)) {
                    return <></>;
                }

                return (
                    <Text style={styles.cardContent}>
                        <Text style={{ fontWeight: "bold", marginEnd: 10 }}>{i18n.t("itrex.courseProgressTitle")}</Text>
                        <Text>
                            {progressPercent}% ({courseProgressInfo.total} / {courseProgressInfo.totalMax})
                        </Text>
                    </Text>
                );
            }
        }
    }

    function navigateToCourse(course: ICourse) {
        navigation.dispatch({
            ...CommonActions.reset({
                index: 0,
                routes: [{ name: NavigationRoutes.ROUTE_COURSE_DETAILS, params: { courseId: course.id } }],
            }),
        });
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => navigateToCourse(course)} activeOpacity={0.7}>
            {getPublishedSate(course.publishState)}
            <Text style={styles.cardHeader}>{course.name}</Text>
            <View style={styles.break} />

            {getDate(course.startDate, i18n.t("itrex.start"))}
            {getDate(course.endDate, i18n.t("itrex.endDate"))}
            <View style={{ alignItems: "center" }}>
                {getNavToLastContent()}
                {getProgressInfo()}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowRadius: 10,
        shadowOffset: { width: -1, height: 1 },
        margin: 8,
        width: 400,
        backgroundColor: dark.Opacity.darkBlue1,
        zIndex: 10,
    },
    cardHeader: {
        margin: 8,
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    cardContent: {
        fontSize: 15,
        color: "white",
        textAlignVertical: "center",
        margin: 4,
        marginLeft: 32,
        minHeight: 20,
    },
    break: {
        backgroundColor: dark.theme.lightBlue,
        opacity: 0.5,
        margin: 4,
        height: 2,
    },
    publishedState: {
        flexDirection: "row",
        justifyContent: "flex-end",
        margin: 5,
    },
});
