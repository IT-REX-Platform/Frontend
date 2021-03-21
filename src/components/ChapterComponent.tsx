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
import { dateConverter } from "../helperScripts/validateCourseDates";
import { CONTENTREFERENCETYPE, IContent } from "../types/IContent";
import { ITimePeriod } from "../types/ITimePeriod";
import { EndpointsQuiz } from "../api/endpoints/EndpointsQuiz";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IQuiz } from "../types/IQuiz";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
    course: ICourse;
}

const endpointsQuiz = new EndpointsQuiz();
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

    function getQuizComponent(contentReference: IContent) {
        return (
            <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => {
                    console.log(contentReference);
                    navigateToQuiz(contentReference.contentId);
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
                    <Text style={styles.chapterMaterialElementText}>
                        {timePeriods !== undefined &&
                            timePeriods.find((timePeriod) => timePeriod.value === contentReference.timePeriodId)?.label}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.chapterContainer}>
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
                                <View style={styles.chapterMaterialElement}>
                                    {contentReference.contentReferenceType == CONTENTREFERENCETYPE.VIDEO ? (
                                        <>
                                            <MaterialIcons
                                                name="attach-file"
                                                size={28}
                                                color="white"
                                                style={styles.icon}
                                            />
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
                                                            (timePeriod) =>
                                                                timePeriod.value === contentReference.timePeriodId
                                                        )?.label
                                                    }
                                                </Text>
                                            </View>
                                        </>
                                    ) : (
                                        getQuizComponent(contentReference)
                                    )}
                                </View>
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
        </View>
    );

    function navigateToQuiz(contentId: string) {
        console.log(contentId);
        if (contentId !== undefined) {
            const request: RequestInit = RequestFactory.createGetRequest();
            const response = endpointsQuiz.getQuiz(request, contentId);
            response.then((quiz) => {
                console.log(quiz),
                    navigation.navigate("QUIZ_OVERVIEW", {
                        quiz: quiz,
                    });
            });
        }
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
