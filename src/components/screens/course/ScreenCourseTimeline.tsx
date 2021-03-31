/* eslint-disable @typescript-eslint/indent */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TouchableOpacity, Switch } from "react-native";
import { CompositeNavigationProp, useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
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
import { TimelineComponent } from "../../TimelineComponent";
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
import { CONTENTREFERENCETYPE, IContent } from "../../../types/IContent";
import { EndpointsVideo } from "../../../api/endpoints/EndpointsVideo";
import { dateConverter } from "../../../helperScripts/validateCourseDates";
import { TextButton } from "../../uiElements/TextButton";
import { EndpointsQuiz } from "../../../api/endpoints/EndpointsQuiz";

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "COURSE_INFROMATION">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();

    const { course, setCourse } = React.useContext(CourseContext);
    const [user, setUserInfo] = useState<IUser>({});
    const [edit, setEdit] = useState<boolean>();
    const [chapters, setChapters] = useState<IChapter[]>([]);

    // Endpoints
    const courseEndpoint = new EndpointsCourse();
    const endpointsVideos: EndpointsVideo = new EndpointsVideo();
    const endpointsQuiz = new EndpointsQuiz();

    const isFocused = useIsFocused();

    useFocusEffect(
        React.useCallback(() => {
            AuthenticationService.getInstance().getUserInfo(setUserInfo);
            setEditMode();
        }, [AuthenticationService.getInstance().tokenResponse, course])
    );

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setUserInfo(AuthenticationService.getInstance().getUserInfoCached());

            if (isFocused && course.id !== undefined && isActive == true) {
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
                                            contentRef.timePeriod = timePeriod;

                                            if (timePeriod?.chapters === undefined) {
                                                timePeriod.chapters = [];
                                            }

                                            // Search for chapter in timePeriod
                                            let foundChapter = timePeriod.chapters.find(
                                                (tmpChapter) => tmpChapter.id === chapter.id
                                            );

                                            if (foundChapter === undefined) {
                                                foundChapter = {
                                                    courseId: chapter.courseId,
                                                    id: chapter.id,
                                                    name: chapter.name,
                                                    chapterNumber: chapter.chapterNumber,
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
                            receivedCourse.timePeriods?.forEach((timePeriod, idx) => {
                                timePeriod.name = i18n.t("itrex.week") + " " + (idx + 1);
                                timePeriod.fullName =
                                    timePeriod.name +
                                    " ( " +
                                    dateConverter(timePeriod?.startDate) +
                                    " - " +
                                    dateConverter(timePeriod?.endDate) +
                                    " )";
                            });

                            const contents: { [key: string]: IContent[] } = {};

                            // Map Contents to different dictionaries, later we can pass the contentIds to the correct service
                            for (const chapter of receivedCourse.chapters) {
                                if (chapter.contentReferences !== undefined) {
                                    for (const content of chapter.contentReferences) {
                                        if (
                                            content.contentReferenceType !== undefined &&
                                            content.contentId !== undefined
                                        ) {
                                            if (contents[content.contentReferenceType] === undefined) {
                                                contents[content.contentReferenceType] = [];
                                            }
                                            contents[content.contentReferenceType].push(content);
                                        }
                                    }
                                }
                            }

                            // Array of contentId's from die video List
                            const videoIds: string[] =
                                contents[CONTENTREFERENCETYPE.VIDEO] !== undefined
                                    ? contents[CONTENTREFERENCETYPE.VIDEO].map((content) => {
                                          if (content.contentId !== undefined) {
                                              return content.contentId;
                                          }
                                          return "";
                                      })
                                    : [];

                            // Array of contentId's from die quiz List
                            const quizIds: string[] =
                                contents[CONTENTREFERENCETYPE.QUIZ] !== undefined
                                    ? contents[CONTENTREFERENCETYPE.QUIZ].map((content) => {
                                          if (content.contentId !== undefined) {
                                              return content.contentId;
                                          }
                                          return "";
                                      })
                                    : [];

                            // Ask the MediaService for the video metadata
                            const videoPromise = new Promise((resolve, reject) => {
                                if (videoIds != undefined) {
                                    // Create POST request with video IDs in body.
                                    const postVideoRequest = RequestFactory.createPostRequestWithBody(videoIds);

                                    // Get Videos by ContentIds
                                    endpointsVideos.findAllWithIds(postVideoRequest).then((videos) => {
                                        videos.forEach((video) => {
                                            const contentVideo = contents[CONTENTREFERENCETYPE.VIDEO].filter(
                                                (item) => item.contentId === video.id
                                            );
                                            if (contentVideo !== undefined) {
                                                for (const currContent of contentVideo) {
                                                    currContent.video = video;
                                                }
                                            }
                                        });
                                        resolve(true);
                                    });
                                } else {
                                    reject();
                                }
                            });

                            // Load Quiz-Informations
                            const postQuizRequest = RequestFactory.createPostRequestWithBody(quizIds);
                            const quizPromise = new Promise((resolve, reject) => {
                                if (quizIds != undefined) {
                                    endpointsQuiz.findAllByIds(postQuizRequest).then((quizzes) => {
                                        quizzes.forEach((quiz) => {
                                            const contentQuiz = contents[CONTENTREFERENCETYPE.QUIZ].filter(
                                                (item) => item.contentId === quiz.id
                                            );
                                            if (contentQuiz !== undefined) {
                                                for (const currContent of contentQuiz) {
                                                    currContent.quiz = quiz;
                                                }
                                            }
                                        });
                                        resolve(true);
                                    });
                                } else {
                                    reject();
                                }
                            });

                            Promise.all([videoPromise, quizPromise]).then((values) => {
                                if (isActive) {
                                    setCourse(receivedCourse);
                                    if (receivedCourse.chapters !== undefined) {
                                        setChapters(receivedCourse.chapters);
                                    }
                                }
                            });
                        }
                    });
            }

            // Ignore State-Changes if compontent lost focus
            return () => {
                isActive = false;
            };
        }, [isFocused, course.id])
    );

    return (
        <ImageBackground
            source={require("../../../constants/images/Background3.png")}
            style={styles.imageContainer}
            imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "contain" }}>
            {ownerEditMode()}

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {edit === false
                    ? course.timePeriods !== undefined &&
                      course.timePeriods?.length > 0 && (
                          <View style={{ width: "80%" }}>
                              {course.timePeriods?.map((timePeriod) => (
                                  <TimelineComponent
                                      key={timePeriod.id}
                                      edit={edit}
                                      timePeriod={timePeriod}
                                      course={course}></TimelineComponent>
                              ))}
                          </View>
                      )
                    : chapters.map((chapter, idx) => (
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
                      ))}
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
     * Set default edit Mode for Course owner/manager and participant
     */
    function setEditMode() {
        if (user.courses !== undefined && course.id !== undefined) {
            if (user.courses[course.id] === CourseRoles.OWNER || user.courses[course.id] === CourseRoles.MANAGER) {
                setEdit(true);
            } else {
                setEdit(false);
            }
        }
    }

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

        // Create copy of the course
        const tmpCourse: ICourse = {
            id: course.id,
            chapters: tmpChapterList.map((chap) => {
                return { ...chap };
            }),
        };

        // Delete unnecassary stuff for transmission
        tmpCourse.chapters?.forEach((chapter) => {
            if (chapter.contentReferences !== undefined) {
                chapter.contentReferences = [...chapter.contentReferences];
            }

            chapter.contentReferences = chapter.contentReferences?.map((ref) => {
                return { ...ref };
            });

            chapter.contentReferences?.forEach((contentReference) => {
                contentReference.quiz = undefined;
                contentReference.video = undefined;
                contentReference.timePeriod = undefined;
            });
        });

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
    function ownerEditMode() {
        if (user.courses === undefined || course.id === undefined) {
            return <></>;
        }

        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole === CourseRoles.MANAGER) {
            return (
                <>
                    <View style={styles.editMode}>
                        <View style={{ flexDirection: "row" }}>
                            {edit ? (
                                <Text style={styles.editModeText}>{i18n.t("itrex.switchToStudentView")}</Text>
                            ) : (
                                <Text style={styles.editModeText}>{i18n.t("itrex.switchToOwnerView")}</Text>
                            )}
                            <Switch
                                value={edit}
                                onValueChange={() => {
                                    console.log(!edit);
                                    setEdit(!edit);
                                }}></Switch>
                        </View>
                        {edit ? (
                            <View style={{ position: "relative", flexDirection: "row" }}>
                                <TextButton
                                    color="dark"
                                    title={i18n.t("itrex.videoPool")}
                                    onPress={() => navigation.navigate("VIDEO_POOL")}
                                />
                                <TextButton
                                    color="dark"
                                    title={i18n.t("itrex.quizPool")}
                                    onPress={() => navigation.navigate("QUIZ_POOL")}
                                />
                            </View>
                        ) : (
                            <View></View>
                        )}
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
        paddingTop: 20,
    },
    chapterContainer: {
        width: "80%",
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
        height: 70,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row-reverse",
        paddingRight: "20px",
        paddingLeft: "20px",
        position: "relative",
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
});
