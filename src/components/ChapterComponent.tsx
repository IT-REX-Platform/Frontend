/* eslint-disable complexity */
import React, { useState } from "react";
import i18n from "../locales";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dark } from "../constants/themes/dark";
import { IChapter } from "../types/IChapter";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextButton } from "./uiElements/TextButton";
import { CoursePublishState } from "../constants/CoursePublishState";
import { EndpointsQuiz } from "../api/endpoints/EndpointsQuiz";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IQuiz } from "../types/IQuiz";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
    courseId?: string;
}

const endpointsQuiz: EndpointsQuiz = new EndpointsQuiz();
export const ChapterComponent: React.FC<ChapterComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const chapter = props.chapter;
    const courseId = props.courseId;
    const [courseQuizzes, setCourseQuizzes] = useState<IQuiz[]>();
    useFocusEffect(
        React.useCallback(() => {
            if (courseId == undefined) {
                return;
            }
            const request: RequestInit = RequestFactory.createGetRequest();
            const response = endpointsQuiz.getCourseQuizzes(request, courseId);
            response.then(async () => {
                setCourseQuizzes(await response);
            });
        }, [])
    );

    return (
        <View style={styles.chapterContainer}>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>{chapter?.title}</Text>
                <View style={styles.chapterStatus}>{getPublishedSate(CoursePublishState.PUBLISHED)}</View>
            </View>
            <View style={styles.chapterBottomRow}>
                <Text style={styles.chapterMaterialHeader}>{i18n.t("itrex.chapterMaterial")}</Text>
                <View style={styles.chapterMaterialElements}>
                    {chapter?.contents?.map((contentId) => {
                        return (
                            <View style={styles.chapterMaterialElement}>
                                <MaterialIcons name="attach-file" size={28} color="white" style={styles.icon} />
                                <Text style={styles.chapterMaterialElementText}>{contentId}</Text>
                            </View>
                        );
                    })}
                </View>
                <View style={styles.break} />
                <Text style={styles.chapterMaterialHeader}>Chapter Quiz</Text>

                {!props.editMode && AuthenticationService.getInstance().isLecturer() && (
                    <View style={styles.chapterMaterialElements}>
                        {courseQuizzes?.map((quiz) => {
                            return (
                                <View style={styles.chapterMaterialElement}>
                                    <MaterialCommunityIcons
                                        name="head-question-outline"
                                        size={28}
                                        color="white"
                                        style={styles.icon}
                                    />
                                    <Text style={styles.chapterMaterialElementText}>{quiz.name}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {props.editMode && editChapterQuiz()}
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
                            navigation.navigate("CHAPTER", { chapterId: chapter?.id });
                        }}>
                        <MaterialIcons name="edit" size={28} color="white" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    function editChapterQuiz() {
        return (
            <>
                <View style={styles.chapterMaterialElements}>
                    {courseQuizzes?.map((quiz) => {
                        return (
                            <TouchableOpacity
                                style={styles.chapterMaterialElement}
                                onPress={() =>
                                    navigation.navigate("CREATE_QUIZ", {
                                        quiz: quiz,
                                        chapterId: chapter?.id,
                                        courseId: courseId,
                                    })
                                }>
                                <MaterialCommunityIcons
                                    name="head-question-outline"
                                    size={28}
                                    color="white"
                                    style={styles.icon}
                                />
                                <Text style={styles.chapterMaterialElementText}>{quiz.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={styles.chapterMaterialElements}>
                    <TextButton
                        title="Create a Quiz"
                        onPress={() => {
                            navigation.navigate("CREATE_QUIZ", { chapterId: chapter?.id, courseId: courseId });
                        }}
                    />
                </View>
            </>
        );
    }

    function getPublishedSate(isPublished: string | undefined) {
        if (isPublished === CoursePublishState.UNPUBLISHED) {
            return (
                <>
                    <View style={styles.unpublishedCard}>
                        <View style={styles.circleUnpublished} />
                        <Text style={styles.textUnpublished}>{i18n.t("itrex.unpublished")}</Text>
                    </View>
                </>
            );
        } else if (isPublished === CoursePublishState.PUBLISHED) {
            return (
                <>
                    <View style={styles.publishedCard}>
                        <View style={styles.circlePublished} />
                        <Text style={styles.textPublished}>{i18n.t("itrex.published")}</Text>
                    </View>
                </>
            );
        }

        return;
    }
};

const styles = StyleSheet.create({
    chapterContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        width: "80%",
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
        flexDirection: "row",
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
    break: {
        borderBottomColor: dark.theme.lightGreen,
        borderBottomWidth: 2,
        width: "100%",
        borderStyle: "dotted",
        borderWidth: 2,
        marginTop: 1,
    },
});
