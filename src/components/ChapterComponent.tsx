/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dark } from "../constants/themes/dark";
import { IChapter } from "../types/IChapter";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { InfoPublished } from "./uiElements/InfoPublished";
import { InfoUnpublished } from "./uiElements/InfoUnpublished";
import { ICourse } from "../types/ICourse";
import { ICourseProgressTracker } from "../types/ICourseProgressTracker";
import { useNavigation } from "@react-navigation/native";
import { CoursePublishState } from "../constants/CoursePublishState";
import { CONTENTREFERENCETYPE, IContent } from "../types/IContent";
import { EndpointsQuiz } from "../api/endpoints/EndpointsQuiz";
import { RequestFactory } from "../api/requests/RequestFactory";
import { ContentProgressInfo } from "./uiElements/ContentProgressInfo";
import ProgressService from "../services/ProgressService";
import { ContentProgressTrackerState } from "../constants/ContentProgressTrackerState";
import { CourseRoles } from "../constants/CourseRoles";
import { IUser } from "../types/IUser";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
    course: ICourse;
}

export const ChapterComponent: React.FC<ChapterComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const chapter = props.chapter;
    const course = props.course;
    const editMode = props.editMode;

    // User info.
    const [user, setUserInfo] = useState<IUser>({});
    useEffect(() => {
        setUserInfo(AuthenticationService.getInstance().getUserInfoCached());
    }, []);

    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});
    useEffect(() => {
        updateCourseProgress();
    }, []);

    return (
        <TouchableOpacity
            style={styles.chapterContainer}
            onPress={() => {
                editMode == true
                    ? navigation.navigate("CHAPTER", { chapterId: chapter?.id })
                    : navigation.navigate("CHAPTER_CONTENT", { chapterId: chapter?.id });
            }}>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>
                    {chapter?.chapterNumber}. {chapter?.name}
                </Text>
                <Text style={styles.showWeek}>{getWeeks()}</Text>
            </View>
            <View style={styles.chapterBottomRow}>
                <View style={styles.chapterMaterialElements}>
                    {chapter?.contentReferences?.map((contentReference) => {
                        return (
                            <View style={styles.chapterMaterialElement}>
                                {contentReference.contentReferenceType == CONTENTREFERENCETYPE.VIDEO && (
                                    <>
                                        <MaterialIcons name="attach-file" size={28} color="white" style={styles.icon} />
                                    </>
                                )}

                                {contentReference.contentReferenceType == CONTENTREFERENCETYPE.QUIZ && (
                                    <>
                                        <MaterialCommunityIcons
                                            name="file-question-outline"
                                            size={28}
                                            color="white"
                                            style={styles.icon}
                                        />
                                    </>
                                )}

                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                    <Text style={styles.chapterMaterialElementText}>
                                        {contentReference.contentReferenceType == CONTENTREFERENCETYPE.VIDEO
                                            ? contentReference?.video?.title
                                            : ""}
                                        {contentReference.contentReferenceType == CONTENTREFERENCETYPE.QUIZ
                                            ? contentReference?.quiz?.name
                                            : ""}
                                    </Text>
                                    <Text style={styles.chapterMaterialElementText}>
                                        {contentReference.timePeriod?.fullName}
                                    </Text>

                                    {getProgressInfo(contentReference)}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </TouchableOpacity>
    );

    function updateCourseProgress() {
        if (course.id === undefined) {
            return;
        }

        ProgressService.getInstance().updateCourseProgressFor(course.id, (receivedProgress) => {
            setCourseProgress(receivedProgress);
        });
    }

    function markProgress(contentRef: IContent) {
        // TODO: Adjust and/or reuse this for actual progress.
        // For now it just touches the content once or completes it when touched.

        if (course.id === undefined) {
            return;
        }

        const progressService = ProgressService.getInstance();

        progressService.getContentProgressInfo(course.id, contentRef, (status, progress) => {
            // New progress if needed.
            const newProgress = progress + 0.1;

            switch (status) {
                case ContentProgressTrackerState.STARTED:
                    progressService.updateContentProgress(course.id, contentRef, newProgress, (createdProgress) => {
                        console.log("Updated progress: ");
                        console.log(createdProgress);

                        if (newProgress >= 1) {
                            progressService.completeContentProgress(course.id, contentRef, (completedProgress) => {
                                console.log("Completed progress: ");
                                console.log(completedProgress);

                                updateCourseProgress();
                            });
                        } else {
                            updateCourseProgress();
                        }
                    });
                    break;

                case undefined:
                    progressService.createContentProgress(course.id, contentRef, (createdProgress) => {
                        console.log("Created progress: ");
                        console.log(createdProgress);

                        updateCourseProgress();
                    });
                    break;

                case ContentProgressTrackerState.COMPLETED:
                default:
                    // Do nothing.
                    break;
            }
        });
    }

    function getProgressInfo(contentRef: IContent) {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.PARTICIPANT || !editMode) {
            if (courseProgress.contentProgressTrackers === undefined || contentRef.id === undefined) {
                return;
            }
            return <ContentProgressInfo contentTracker={courseProgress.contentProgressTrackers[contentRef.id]} />;
        }

        return;
    }

    /**
     * Returns the lowest and the highest week of the contentReferences
     * @returns Week String
     */
    function getWeeks(): string | undefined {
        if (chapter?.contentReferences !== undefined) {
            // Sort ContentReferences
            const tmpContentReferences = [...chapter.contentReferences];

            tmpContentReferences.sort((contentA, contentB) => {
                const timePeriodA = course.timePeriods?.find((timePeriod) => timePeriod.id === contentA.timePeriodId);
                const timePeriodB = course.timePeriods?.find((timePeriod) => timePeriod.id === contentB.timePeriodId);

                if (timePeriodA?.startDate !== undefined && timePeriodB?.startDate !== undefined) {
                    if (timePeriodA?.startDate < timePeriodB?.startDate) {
                        return -1;
                    }
                    if (timePeriodA?.startDate > timePeriodB?.startDate) {
                        return 1;
                    }
                    return 0;
                }
                return 0;
            });
            if (tmpContentReferences.length == 0) {
                return "";
            }

            const lowestTimePeriod = course.timePeriods?.find(
                (timePeriod) => timePeriod.id == tmpContentReferences[0].timePeriodId
            );

            const highestTimePeriod = course.timePeriods?.find(
                (timePeriod) => timePeriod.id == tmpContentReferences[tmpContentReferences.length - 1].timePeriodId
            );

            if (lowestTimePeriod == highestTimePeriod) {
                return lowestTimePeriod?.name;
            }

            return lowestTimePeriod?.name + " - " + highestTimePeriod?.name;
        }
        return "";
    }

    function getPublishedSate(isPublished: string | undefined) {
        if (isPublished === CoursePublishState.UNPUBLISHED) {
            return (
                <>
                    <InfoUnpublished />
                </>
            );
        } else if (isPublished === CoursePublishState.PUBLISHED) {
            return (
                <>
                    <InfoPublished />
                </>
            );
        }

        return;
    }
};

const styles = StyleSheet.create({
    chapterContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        width: "100%",
        marginTop: "1%",
        padding: "1.5%",
        borderWidth: 3,
        borderColor: dark.theme.darkGreen,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    chapterTopRow: {
        width: "100%",
        flex: 2,
    },
    chapterBottomRow: {
        width: "100%",
        flex: 1,
        alignItems: "baseline",
        paddingTop: "1%",
    },
    chapterHeader: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    showWeek: {
        position: "absolute",
        alignSelf: "center",
        color: dark.theme.pink,
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 15,
    },
    chapterMaterialElements: {
        marginBottom: 5,
        paddingTop: "20px",
        flex: 1,
        flexDirection: "column",
        alignSelf: "center",
        width: "100%",
    },
    chapterMaterialElement: {
        flex: 1,
        flexDirection: "row",
        color: "white",
        fontWeight: "bold",
        alignItems: "center",
    },
    chapterMaterialElementText: {
        color: "white",
        fontWeight: "bold",
        margin: 5,
    },
    icon: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});
