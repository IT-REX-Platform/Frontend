/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TouchableOpacity, Switch, unstable_enableLogBox } from "react-native";
import { CompositeNavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { dark } from "../../../constants/themes/dark";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { CourseContext, LocalizationContext } from "../../Context";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ChapterComponent } from "../../ChapterComponent";
import { ICourse } from "../../../types/ICourse";
import AuthenticationService from "../../../services/AuthenticationService";
import i18n from "../../../locales";
import { ScrollView } from "react-native-gesture-handler";
import { EndpointsCourse } from "../../../api/endpoints/EndpointsCourse";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { CourseRoles } from "../../../constants/CourseRoles";
import { IUser } from "../../../types/IUser";
import { MaterialIcons } from "@expo/vector-icons";
import { IChapter } from "../../../types/IChapter";

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "TIMELINE">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();
    const [user, setUserInfo] = useState<IUser>({});

    const courseEndpoint = new EndpointsCourse();

    const [edit, setEdit] = useState(false);

    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);

    const [myCourse, setMyCourse] = useState<ICourse>({});
    const [chapters, setChapters] = useState<IChapter[]>([]);

    const isFocused = useIsFocused();
    useEffect(() => {
        AuthenticationService.getInstance().getUserInfo(setUserInfo);
        if (isFocused && course.id !== undefined) {
            const request: RequestInit = RequestFactory.createGetRequest();
            courseEndpoint
                .getCourse(request, course.id, undefined, i18n.t("itrex.getCourseError"))
                .then((receivedCourse) => {
                    if (receivedCourse.chapters !== undefined) {
                        for (const chapter of receivedCourse.chapters) {
                            if (chapter.contentReferences !== undefined) {
                                for (const contentRef of chapter.contentReferences) {
                                    const timePeriod = receivedCourse.timePeriods?.find(
                                        (period) => period.id === contentRef.timePeriodId
                                    );
                                    if (timePeriod !== undefined) {
                                        if (timePeriod?.chapters === undefined) {
                                            timePeriod.chapters = [];
                                        }

                                        // Search for chapter in timePeriod
                                        let foundChapter = timePeriod.chapters.find(
                                            (tmpChapter) => tmpChapter === chapter.id
                                        );

                                        if (foundChapter === undefined) {
                                            foundChapter = {
                                                courseId: chapter.courseId,
                                                id: chapter.id,
                                                name: chapter.name,
                                            };
                                            foundChapter.contentReferences = [];
                                            timePeriod.chapters.push(foundChapter);
                                        }

                                        foundChapter?.contentReferences?.push(contentRef);
                                    }
                                }
                            }
                        }

                        // Set TimePeriodNames
                        course.timePeriods?.forEach((timePeriod, idx) => {
                            timePeriod.name = i18n.t("itrex.week") + " " + (idx + 1);
                        });

                        setMyCourse(receivedCourse);
                        setChapters(receivedCourse.chapters);
                    }
                });
        }
    }, [isFocused]);

    return (
        <ImageBackground
            source={require("../../../constants/images/Background3.png")}
            style={styles.imageContainer}
            imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "contain" }}>
            {lecturerEditMode()}

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {chapters.length === 0 ? (
                    <View>{!edit && <Text style={styles.textStyle}>{i18n.t("itrex.noChapters")}</Text>}</View>
                ) : (
                    chapters.map((chapter, idx) => (
                        <View style={styles.chapterContainer}>
                            <ChapterComponent
                                key={chapter.id}
                                editMode={edit}
                                chapter={chapter}
                                course={course}></ChapterComponent>
                            {edit && (
                                <View style={styles.chapterArrows}>
                                    {idx !== 0 && (
                                        <TouchableOpacity onPress={() => reorderChapters(idx - 1, idx)}>
                                            <MaterialIcons
                                                name="keyboard-arrow-up"
                                                size={28}
                                                color="white"
                                                style={{}}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    {idx !== chapters.length - 1 && (
                                        <TouchableOpacity onPress={() => reorderChapters(idx + 1, idx)}>
                                            <MaterialIcons
                                                name="keyboard-arrow-down"
                                                size={28}
                                                color="white"
                                                style={{}}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                )}

                {/*myCourse.timePeriods?.length === 0 ? (
                    <View>{!edit && <Text style={styles.textStyle}>{i18n.t("itrex.noChapters")}</Text>}</View>
                ) : (
                    myCourse.timePeriods?.map((timePeriod) => (
                        <TimelineComponent
                            key={timePeriod.id}
                            edit={edit}
                            timePeriod={timePeriod}
                            course={myCourse}></TimelineComponent>
                    ))
                    )*/}
                {edit && (
                    <View style={styles.addChapterContainer}>
                        <TouchableOpacity
                            style={styles.btnAdd}
                            onPress={() => {
                                navigation.navigate("CHAPTER", {
                                    chapterId: undefined,
                                });
                            }}>
                            <Text style={styles.txtAddChapter}>{i18n.t("itrex.addChapter")}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );

    /**
     * Reorder the Chapter objects in the chapter list, to save them in the correct order
     *
     * @param from
     * @param to
     */
    function reorderChapters(to: number, from: number) {
        const tmpChapterList = [...chapters];
        const elementToCut = tmpChapterList.splice(from, 1)[0];
        tmpChapterList.splice(to, 0, elementToCut);

        // Adjust ChapterOrder
        tmpChapterList.forEach((chapter, idx) => {
            chapter.chapterNumber = idx + 1;
        });

        const tmpCourse: ICourse = {
            id: myCourse.id,
            chapters: tmpChapterList,
        };
        const patchRequest: RequestInit = RequestFactory.createPatchRequest(tmpCourse);
        const courseEndpoint = new EndpointsCourse();
        courseEndpoint
            .patchCourse(patchRequest)
            .then(() => {
                setChapters([...tmpChapterList]);
            })
            .catch(() => {
                // Restore old order
                setChapters([...chapters]);
            });
    }

    // eslint-disable-next-line complexity
    function lecturerEditMode() {
        if (user.courses === undefined || course.id === undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole === undefined) {
            return (
                <>
                    <View style={styles.editMode}>
                        <Text style={styles.editModeText}>{i18n.t("itrex.editMode")}</Text>
                        <Switch
                            value={edit}
                            onValueChange={() => {
                                setEdit(!edit);
                            }}></Switch>
                    </View>
                </>
            );
        }
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        paddingTop: "3%",
        backgroundColor: dark.theme.darkBlue1,
    },
    scrollContainer: {
        width: "screenWidth",
        alignItems: "center",
        paddingBottom: 20,
    },
    chapterContainer: {
        width: "80%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "unset",
        marginTop: 5,
    },
    chapterArrows: {
        flex: 1,
    },
    editMode: {
        alignSelf: "flex-end",
        flexDirection: "row",
        paddingRight: "20px",
        paddingTop: "20px",
    },
    editModeText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        paddingRight: "20px",
    },
    addChapterContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        height: "100px",
        width: "80%",
        marginTop: "1%",
        padding: "0.5%",
        borderWidth: 3,
        borderColor: dark.theme.lightBlue,
    },
    txtAddChapter: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    btnAdd: {
        width: "100%",
        height: "100%",
        borderWidth: 2,
        borderColor: "rgba(79,175,165,1.0)",
        borderRadius: 25,
        borderStyle: "dotted",
        alignItems: "center",
        justifyContent: "center",
    },
    textStyle: {
        margin: 10,
        color: "white",
        fontWeight: "bold",
    },
});
