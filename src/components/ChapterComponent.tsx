/* eslint-disable complexity */
import React from "react";
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
import { useNavigation } from "@react-navigation/native";
import { CoursePublishState } from "../constants/CoursePublishState";
import { CONTENTREFERENCETYPE, IContent } from "../types/IContent";
import { EndpointsQuiz } from "../api/endpoints/EndpointsQuiz";
import { RequestFactory } from "../api/requests/RequestFactory";

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

    function getQuizComponent(contentReference: IContent) {
        return (
            <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                    contentReference !== undefined && navigateToQuiz(contentReference.contentId);
                }}>
                <MaterialCommunityIcons name="file-question-outline" size={28} color="white" style={styles.icon} />

                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Text style={styles.chapterMaterialElementText}>{contentReference.contentId}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.chapterContainer}
            onPress={() =>
                navigation.navigate("CHAPTER", {
                    chapterId: chapter?.id,
                })
            }>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>
                    {chapter?.chapterNumber}. {chapter?.name}
                </Text>
                <Text style={styles.showWeek}>{getWeeks()}</Text>
                {/* TODO: add real publish/unpublished state to the chapterss*/}
                <View style={styles.chapterStatus}>{getPublishedSate(CoursePublishState.PUBLISHED)}</View>
            </View>
            <View style={styles.chapterBottomRow}>
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
                <View style={styles.chapterMaterialElements}>
                    {chapter?.contentReferences?.map((contentReference) => {
                        return (
                            <View style={styles.chapterMaterialElement}>
                                {contentReference.contentReferenceType == CONTENTREFERENCETYPE.VIDEO ? (
                                    <>
                                        <MaterialIcons name="attach-file" size={28} color="white" style={styles.icon} />
                                    </>
                                ) : (
                                    getQuizComponent(contentReference)
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
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </TouchableOpacity>
    );

    function navigateToQuiz(contentId: string | undefined) {
        if (contentId !== undefined) {
            const endpointsQuiz = new EndpointsQuiz();
            const request: RequestInit = RequestFactory.createGetRequest();
            const response = endpointsQuiz.getQuiz(request, contentId);
            response.then((quiz) => {
                navigation.navigate("QUIZ_OVERVIEW", {
                    quiz: quiz,
                });
            });
        }
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
    chapterEditRow: {
        position: "absolute",
        right: 0,
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
    showWeek: {
        position: "absolute",
        alignSelf: "center",
        color: dark.theme.pink,
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: 15,
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
