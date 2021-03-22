/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import i18n from "../locales";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dark } from "../constants/themes/dark";
import { IChapter } from "../types/IChapter";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { InfoPublished } from "./uiElements/InfoPublished";
import { InfoUnpublished } from "./uiElements/InfoUnpublished";
import { ICourse } from "../types/ICourse";
import { IContent } from "../types/IContent";
import { ICourseProgressTracker } from "../types/ICourseProgressTracker";
import { useNavigation } from "@react-navigation/native";
import { CoursePublishState } from "../constants/CoursePublishState";
import { dateConverter } from "../helperScripts/validateCourseDates";
import { CONTENTREFERENCETYPE } from "../types/IContent";
import { ContentProgressInfo } from "./uiElements/ContentProgressInfo";
import ProgressService from "../services/ProgressService";
import { ContentProgressTrackerState } from "../constants/ContentProgressTrackerState";

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

    const timePeriods = course.timePeriods?.map((timePeriod, idx) => {
        return {
            value: timePeriod.id,
            label:
                i18n.t("itrex.week") +
                " " +
                (idx + 1) +
                " (" +
                dateConverter(timePeriod.startDate) +
                " - " +
                dateConverter(timePeriod.endDate) +
                ")",
        };
    });

    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});
    useEffect(() => {
        updateCourseProgress();
    }, []);

    return (
        <TouchableOpacity
            style={styles.chapterContainer}
            onPress={() => {
                navigation.navigate("CHAPTER_CONTENT", { chapterId: chapter?.id });
            }}>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>
                    {chapter?.chapterNumber}. {chapter?.name}
                </Text>
                {/* TODO: add real publish/unpublished state to the chapterss*/}
                <View style={styles.chapterStatus}>{getPublishedSate(CoursePublishState.PUBLISHED)}</View>
            </View>
            <View style={styles.chapterBottomRow}>
                <Text style={styles.chapterMaterialHeader}>{i18n.t("itrex.chapterMaterial")}</Text>
                <View style={styles.chapterMaterialElements}>
                    {timePeriods !== undefined &&
                        chapter?.contentReferences?.map((contentReference) => {
                            return (
                                <TouchableOpacity
                                    style={styles.chapterMaterialElement}
                                    onPress={() => markProgress(contentReference)}>
                                    {contentReference.contentReferenceType == CONTENTREFERENCETYPE.VIDEO ? (
                                        <MaterialIcons name="attach-file" size={28} color="white" style={styles.icon} />
                                    ) : (
                                        <MaterialCommunityIcons
                                            name="file-question-outline"
                                            size={28}
                                            color="white"
                                            style={styles.icon}
                                        />
                                    )}

                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}>
                                        <Text style={styles.chapterMaterialElementText}>
                                            {contentReference.contentId}
                                        </Text>
                                        <Text style={styles.chapterMaterialElementText}>
                                            {
                                                timePeriods.find(
                                                    (timePeriod) => timePeriod.value === contentReference.timePeriodId
                                                )?.label
                                            }
                                        </Text>
                                        {getProgressInfo(contentReference)}
                                        {/*props.editMode ? (
                                                <DropDown
                                                    options={timePeriods}
                                                    defaultValue={timePeriods.find(
                                                        (timePeriod) => timePeriod.value === contentReference.timePeriodId
                                                    )}
                                                    menuPortalTarget={document.body}
                                                    menuPosition={"fixed"}></DropDown>
                                            ) : (

                                            )*/}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </View>
            </View>
            {props.editMode && AuthenticationService.getInstance().isLecturer() && (
                <View style={styles.chapterEditRow}>
                    {/**<TouchableOpacity
                        onPress={() => {
                            courseService.deleteChapter(chapter?.id);
                        }}>
                        <MaterialCommunityIcons name="trash-can" size={28} color="white" style={styles.icon} />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("CHAPTER", {
                                chapterId: chapter?.id,
                            });
                        }}>
                        <MaterialIcons name="edit" size={28} color="white" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            )}
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
        if (courseProgress.contentProgressTrackers === undefined) {
            return;
        }
        if (contentRef.id === undefined) {
            return;
        }

        return <ContentProgressInfo contentTracker={courseProgress.contentProgressTrackers[contentRef.id]} />;
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
    chapterEditRow: {
        width: "100%",
        flex: 2,
        flexDirection: "row-reverse",
    },
    chapterHeader: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    chapterStatus: {
        alignSelf: "flex-end",
        position: "absolute",
        color: "white",
        fontWeight: "bold",
    },
    chapterMaterialHeader: {
        marginTop: 10,
        alignSelf: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },
    chapterMaterialElements: {
        marginBottom: 5,
        paddingTop: "20px",
        flex: 1,
        flexDirection: "column",
        alignSelf: "center",
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
    },
    icon: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});
