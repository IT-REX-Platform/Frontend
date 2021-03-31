/* eslint-disable complexity */
/* eslint-disable max-lines */
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState } from "react";
import i18n from "../../../locales";
import { dark } from "../../../constants/themes/dark";
import { CourseContext, LocalizationContext } from "../../Context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CompositeNavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { CourseStackParamList, RootDrawerParamList } from "../../../constants/navigators/NavigationRoutes";
import { IChapter } from "../../../types/IChapter";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../../api/endpoints/EndpointsChapter";
import { ListItem } from "react-native-elements";
import { IVideo } from "../../../types/IVideo";
import { EndpointsVideo } from "../../../api/endpoints/EndpointsVideo";
import { loggerFactory } from "../../../../logger/LoggerConfig";
import { calculateVideoSize } from "../../../services/calculateVideoSize";
import DraggableFlatList from "react-native-draggable-flatlist";
import { TextButton } from "../../uiElements/TextButton";
import { CONTENTREFERENCETYPE, IContent } from "../../../types/IContent";
import { EndpointsContentReference } from "../../../api/endpoints/EndpointsContentReference";
import { IQuiz } from "../../../types/IQuiz";
import { EndpointsQuiz } from "../../../api/endpoints/EndpointsQuiz";
import { contentPoolStyles } from "../../contentPoolComponents/contentPoolStyles";
import { DropDown } from "../../uiElements/Dropdown";

type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "CHAPTER">,
    DrawerNavigationProp<RootDrawerParamList>
>;

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CHAPTER">;

const endpointsVideo = new EndpointsVideo();
const endpointsQuiz = new EndpointsQuiz();
export const ScreenAddChapter: React.FC = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();
    const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
    let chapterId = route.params.chapterId;

    if (chapterId == "undefined") {
        chapterId = undefined;
    }
    //const [image, setImage] = useState(null);

    // Loading icon state.
    const [isLoading, setLoading] = useState(true);

    const { course } = React.useContext(CourseContext);

    const initialCourseName = chapterId == undefined ? i18n.t("itrex.myNewChapter") : "";
    const chapterEndpoint = new EndpointsChapter();
    const contentReferenceEndpoint = new EndpointsContentReference();
    const [chapter, setChapter] = useState<IChapter>({} as IChapter);

    const [chapterName, setChapterName] = useState<string | undefined>(initialCourseName);

    const [contentList, setContentList] = useState<IContent[]>([]);

    const [videoPoolList, setVideoPoolList] = useState<IVideo[]>([]);

    const [quizPoolList, setQuizPoolList] = useState<IQuiz[]>([]);

    const initialSelection: { [id: string]: string } = {};
    const [selectedValues, setSelectedValues] = useState(initialSelection);

    const timePeriods = course.timePeriods?.map((timePeriod) => {
        return {
            value: timePeriod.id,
            label: timePeriod.fullName,
        };
    });

    // Render UI according to un-/available videos data.
    const renderUi = () => {
        // Display loading icon if getAllVideos() request is still processing.
        if (isLoading) {
            loggerService.trace("Displaying loading icon.");
            return (
                <View style={styles.containerCentered}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        loggerService.trace("Displaying video list.");
        return (
            <View style={styles.containerTop}>
                <Text style={{ marginBottom: 10, fontSize: 20, color: "white" }}>{i18n.t("itrex.videoPoolList")}</Text>
                <FlatList
                    style={styles.list}
                    showsVerticalScrollIndicator={true}
                    data={videoPoolList}
                    renderItem={listItem}
                    keyExtractor={(item) => `draggable-item-${item.id}`}
                    ListEmptyComponent={emptyVideoList}
                />
            </View>
        );
    };

    const renderQuizList = () => {
        if (isLoading) {
            loggerService.trace("Displaying loading icon.");
            return (
                <View style={styles.containerCentered}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }
        loggerService.trace("Displaying quiz list.");
        return (
            <View style={styles.containerTop}>
                <Text style={{ marginBottom: 10, fontSize: 20, color: "white" }}>{i18n.t("itrex.quizPoolList")}</Text>
                <FlatList
                    style={styles.list}
                    showsVerticalScrollIndicator={true}
                    data={quizPoolList}
                    renderItem={quizListItem}
                    keyExtractor={(item) => `draggableQuiz-item-${item.id}`}
                    ListEmptyComponent={emptyQuizList}
                />
            </View>
        );
    };

    // Creates a list for the left side, so that videos can be removed
    const listRemoveItem = ({ item, drag }: { item: IContent; drag: undefined }) => (
        <View>
            <ListItem
                containerStyle={{
                    marginBottom: 5,
                    backgroundColor: dark.theme.darkBlue2,
                    borderColor: dark.theme.darkBlue4,
                    borderWidth: 2,
                    borderRadius: 5,
                    maxWidth: 470,
                }}>
                <TouchableOpacity onPress={() => removeContent(item)}>
                    <MaterialIcons name="remove" size={28} color="white" style={styles.icon} />
                </TouchableOpacity>
                {getContentIcon(item)}
                <ListItem.Content>
                    <TouchableOpacity onLongPress={drag}>
                        <ListItem.Title style={styles.listItemTitle} numberOfLines={3} lineBreakMode="tail">
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}>
                                {getContentName(item)}
                            </View>
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.listItemSubtitle}>
                            {getContentSubtitle(item)}
                        </ListItem.Subtitle>
                        <ListItem.Content style={{ marginTop: 5 }}>
                            {timePeriods !== undefined && (
                                <DropDown
                                    options={timePeriods}
                                    defaultValue={timePeriods.find(
                                        (timePeriod) => timePeriod.value === item.timePeriodId
                                    )}
                                    menuPortalTarget={document.body}
                                    menuPosition={"fixed"}
                                    onChange={(option) => {
                                        if (item.id !== undefined) {
                                            const itemId = item.id;
                                            const value = option?.value;
                                            if (itemId !== undefined && value !== undefined) {
                                                selectedValues[itemId] = value;
                                                setSelectedValues(selectedValues);
                                            }
                                        }
                                    }}
                                />
                            )}
                        </ListItem.Content>
                    </TouchableOpacity>
                </ListItem.Content>
            </ListItem>
        </View>
    );

    // Creates a list for the right side, so that videos can be added to a chapter
    const listItem = ({ item }: { item: IVideo }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                backgroundColor: dark.theme.darkBlue2,
                borderColor: dark.theme.darkBlue4,
                borderWidth: 2,
                borderRadius: 5,
                maxWidth: 250,
            }}>
            <TouchableOpacity onPress={() => addVideo(item)}>
                <MaterialIcons name="add" size={28} color="white" style={styles.icon} />
            </TouchableOpacity>
            <MaterialCommunityIcons name="video-vintage" size={28} color="white" />

            <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle} numberOfLines={2} lineBreakMode="tail">
                    {item.title}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.listItemSubtitle}>{calculateVideoSize(item.length)}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );

    // Creation of each item of video list.
    const quizListItem = ({ item }: { item: IQuiz }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                backgroundColor: dark.theme.darkBlue2,
                borderColor: dark.theme.darkBlue4,
                borderWidth: 2,
                borderRadius: 5,
                width: 250,
            }}>
            <TouchableOpacity onPress={() => addQuiz(item)}>
                <MaterialIcons name="add" size={28} color="white" style={styles.icon} />
            </TouchableOpacity>
            <MaterialCommunityIcons name="file-question-outline" size={28} color="white" />

            <ListItem.Content>
                <ListItem.Title style={contentPoolStyles.listItemTitle} numberOfLines={2} lineBreakMode="tail">
                    {item.name}
                </ListItem.Title>
                <ListItem.Subtitle style={contentPoolStyles.listItemSubtitle} numberOfLines={1} lineBreakMode="tail">
                    {i18n.t("itrex.questions")} {item.questions.length}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );

    // Info that the list is empty.
    const emptyVideoList = () => {
        return (
            <View style={contentPoolStyles.infoTextBox}>
                <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.noVideosAvailable")}</Text>
            </View>
        );
    };

    // Info that the list is empty.
    const emptyQuizList = () => {
        return (
            <View style={contentPoolStyles.infoTextBox}>
                <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.noQuizzesAvailable")}</Text>
            </View>
        );
    };

    function getContentIcon(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                return <MaterialCommunityIcons name="video-vintage" size={28} color="white" />;
            case CONTENTREFERENCETYPE.QUIZ:
                return <MaterialCommunityIcons name="file-question-outline" size={28} color="white" />;
        }
    }

    function getContentName(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                return <Text>{item.video?.title}</Text>;
            case CONTENTREFERENCETYPE.QUIZ:
                return <Text>{item.quiz?.name}</Text>;
        }
    }

    function getContentSubtitle(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                return calculateVideoSize(item.video?.length);
            case CONTENTREFERENCETYPE.QUIZ:
                return (
                    <Text>
                        {i18n.t("itrex.questions")} {item.quiz?.questions.length}
                    </Text>
                );
        }
    }

    /**
     * Add Quiz to Chapter List
     * @param video
     */
    function addQuiz(quiz: IQuiz) {
        const index = quizPoolList.indexOf(quiz);
        if (index > -1) {
            quizPoolList.splice(index, 1);
        }

        // Create new ContentReference
        const contentRef: IContent = {
            chapterId: chapterId,
            contentId: quiz.id,
            id: quiz.id,
            quiz: quiz,
            isPersistent: false,
            contentReferenceType: CONTENTREFERENCETYPE.QUIZ,
        };
        setContentList([...contentList, contentRef]);
    }

    /**
     * Add Video to Chapter List
     * @param video
     */
    function addVideo(video: IVideo) {
        const index = videoPoolList.indexOf(video);
        if (index > -1) {
            videoPoolList.splice(index, 1);
        }

        // Create new ContentReference
        const contentRef: IContent = {
            chapterId: chapterId,
            contentId: video.id,
            video: video,
            id: video.id,
            isPersistent: false,
            contentReferenceType: CONTENTREFERENCETYPE.VIDEO,
        };
        setContentList([...contentList, contentRef]);
    }

    /**
     * Remove Video from Chapter List
     * @param video
     */
    function removeContent(content: IContent) {
        const index = contentList.indexOf(content);
        if (index > -1) {
            contentList.splice(index, 1);
        }
        setContentList([...contentList]);
        switch (content.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                if (content.video !== undefined) {
                    setVideoPoolList([...videoPoolList, content.video]);
                }
                break;
            case CONTENTREFERENCETYPE.QUIZ:
                if (content.quiz !== undefined) {
                    setQuizPoolList([...quizPoolList, content.quiz]);
                }
        }
    }

    // Use the whole structure from the context ??
    useFocusEffect(
        React.useCallback(() => {
            if (chapterId != undefined) {
                const newContentList: IContent[] = [];
                loggerService.trace("Getting all videos of course: " + course.id);
                const request: RequestInit = RequestFactory.createGetRequest();
                chapterEndpoint
                    .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
                    .then((chapter) => {
                        setChapter(chapter);
                        setChapterName(chapter.name);
                        loggerService.trace("Chater name: " + chapterName);
                        _getAllVideos(course.id).then((videos) => {
                            // Are there already contents in this chapter ?
                            if (chapter.contentReferences !== undefined) {
                                // Remove assigned contents from the pool, and add those to the "contentList"
                                for (const contentReference of chapter.contentReferences) {
                                    if (contentReference.contentReferenceType == CONTENTREFERENCETYPE.VIDEO) {
                                        const videoInPool = videos.findIndex(
                                            (video) => video.id === contentReference.contentId
                                        );

                                        if (videoInPool !== -1) {
                                            // Add To Content-List
                                            // Create new ContentReference
                                            const contentRef: IContent = {
                                                chapterId: chapterId,
                                                contentId: videos[videoInPool].id,
                                                video: videos[videoInPool],
                                                id: contentReference.id,
                                                timePeriodId: contentReference.timePeriodId,
                                                contentReferenceType: CONTENTREFERENCETYPE.VIDEO,
                                            };
                                            newContentList.push(contentRef);
                                            // Remove from Pool-List
                                            videos.splice(videoInPool, 1);
                                        }
                                    }

                                    setVideoPoolList([...videos]);
                                }
                            }
                        });

                        _getAllQuizzes().then((quizzes) => {
                            // Are there already contents in this chapter ?
                            if (chapter.contentReferences !== undefined) {
                                // Remove assigned contents from the pool, and add those to the "contentList"
                                for (const contentReference of chapter.contentReferences) {
                                    if (contentReference.contentReferenceType == CONTENTREFERENCETYPE.QUIZ) {
                                        const quizIndex = quizzes.findIndex(
                                            (quiz) => quiz.id === contentReference.contentId
                                        );

                                        if (quizIndex !== -1) {
                                            // Add To Content-List
                                            // Create new ContentReference
                                            const contentRef: IContent = {
                                                chapterId: chapterId,
                                                contentId: quizzes[quizIndex].id,
                                                quiz: quizzes[quizIndex],
                                                id: contentReference.id,
                                                timePeriodId: contentReference.timePeriodId,
                                                contentReferenceType: CONTENTREFERENCETYPE.QUIZ,
                                            };
                                            newContentList.push(contentRef);
                                            // Remove from Pool-List
                                            quizzes.splice(quizIndex, 1);
                                        }
                                    }
                                }

                                setQuizPoolList([...quizzes]);
                            }
                        });

                        setContentList(newContentList);
                    });
            } else {
                _getAllVideos(course.id);
                _getAllQuizzes();
            }
        }, [chapterId])
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../constants/images/Background2.png")}
                style={styles.image}
                imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "stretch" }}>
                <View style={[styles.headContainer]}>
                    <View style={styles.borderContainer}>
                        {/*<TextInput label="name" value={courseName} onChangeText={(text) => setCourseName(text)} />*/}
                        <TextInput
                            style={styles.courseHeader}
                            value={chapterName}
                            onChangeText={(text) => setChapterName(text)}
                        />
                        <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                    </View>
                    <View style={{ flexDirection: "row", paddingRight: "20px" }}>
                        <TextButton title={i18n.t("itrex.saveAndReturn")} onPress={() => saveChapter(true)} />

                        <View>
                            <TextButton title={i18n.t("itrex.save")} onPress={() => saveChapter(false)} />
                        </View>
                    </View>
                </View>

                <View style={styles.headContainer}></View>

                <View style={styles.contentContainer}>
                    <View style={styles.sequenceArea}>
                        <View style={styles.containerTop}>
                            <Text style={{ marginBottom: 10, fontSize: 20, color: "white" }}>
                                {i18n.t("itrex.chapterContentList")}
                            </Text>
                            <DraggableFlatList
                                style={styles.list}
                                showsVerticalScrollIndicator={true}
                                data={contentList}
                                renderItem={listRemoveItem}
                                keyExtractor={(item) => `draggable1-item-${item.id}`}
                                onDragEnd={({ to, from }) => reorderContent(to, from)}
                            />
                        </View>
                    </View>
                    <View style={styles.contentContainerAdd}>
                        <View style={styles.containerTop}>{renderUi()}</View>
                    </View>
                    <View style={styles.contentContainerAdd}>
                        <View style={styles.containerTop}>{renderQuizList()}</View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );

    function saveChapter(returnToOverview: boolean) {
        // Validate start/end Date
        // Check if start and Enddate are set

        // Create new Chapter
        if (chapterId == undefined) {
            const chapterNumber = course.chapters !== undefined ? course.chapters.length + 1 : 1;
            const myNewChapter: IChapter = {
                name: chapterName,
                courseId: course.id,
                chapterNumber: chapterNumber,
            };
            const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(myNewChapter);

            chapterEndpoint.createChapter(postRequest).then((chapter: IChapter) => {
                // Assign the Videos
                Promise.all(
                    contentList.map((content: IContent) => {
                        content.chapterId = chapter.id;

                        return new Promise((resolve) => {
                            // This is a new Content, the current id is only temp
                            if (content.id !== undefined) {
                                // Search for TimePeriod
                                if (selectedValues[content.id] !== undefined) {
                                    content.timePeriodId = selectedValues[content.id];
                                }
                                content.id = undefined;
                            }

                            const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(content);

                            contentReferenceEndpoint.createContentReference(postRequest).then((contentRef) => {
                                contentRef.isPersistent = true;
                                resolve(contentRef);
                            });
                        });
                    })
                ).then(() => {
                    if (returnToOverview) {
                        // Navigate back to Timeline
                        navigation.navigate("INFO", { screen: "OVERVIEW" });
                    } else {
                        // Navigate to the new Chapter
                        navigation.navigate("CHAPTER", { chapterId: chapter.id });
                    }
                });
            });
        } else {
            // Update an existing chapter
            chapter.name = chapterName;

            //How to reorder the contents ?
            Promise.all(
                contentList.map((content: IContent) => {
                    return new Promise((resolve) => {
                        //content.chapterId = chapter.id;

                        if (content.id !== undefined) {
                            // Search for TimePeriod
                            if (selectedValues[content.id] !== undefined) {
                                content.timePeriodId = selectedValues[content.id];
                            }
                        }

                        // Create new Content
                        if (content.isPersistent == false) {
                            content.id = undefined;

                            const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(content);

                            return contentReferenceEndpoint.createContentReference(postRequest).then((contentRef) => {
                                content.isPersistent = true;
                                content.id = contentRef.id;

                                resolve(contentRef);
                            });
                        }

                        resolve(true);
                    });
                })
            ).then(() => {
                chapter.contentReferences = contentList;
                const patchRequest: RequestInit = RequestFactory.createPatchRequest(chapter);
                chapterEndpoint.patchChapter(
                    patchRequest,
                    i18n.t("itrex.chapterUpdateSuccess"),
                    i18n.t("itrex.updateChapterError")
                );

                if (returnToOverview) {
                    // Navigate back to Timeline
                    navigation.navigate("INFO", { screen: "OVERVIEW" });
                } else {
                    // Navigate to the new Chapter
                    navigation.navigate("CHAPTER", { chapterId: chapter.id });
                }
            });
        }
    }

    /**
     * Reorder the video objects in the content list, to save them in the correct order
     *
     * @param from
     * @param to
     */
    function reorderContent(to: number, from: number) {
        contentList.splice(to, 0, contentList.splice(from, 1)[0]);
    }

    /**
     * Method gets all videos belonging to specified course ID.
     *
     * @param courseId ID of the course to which the videos belong.
     */
    async function _getAllVideos(courseId?: string): Promise<IVideo[]> {
        if (courseId == undefined) {
            loggerService.warn("Course ID undefined, can't get videos.");
            setLoading(false);
            return [];
        }
        loggerService.trace("Getting all videos of course: " + courseId);

        const request: RequestInit = RequestFactory.createGetRequest();
        return endpointsVideo
            .findAllVideosOfACourse(request, courseId, undefined, i18n.t("itrex.getVideosError"))
            .then((videosReceived: IVideo[]) => {
                setVideoPoolList(videosReceived);
                return videosReceived;
            })
            .finally(() => setLoading(false));
    }

    async function _getAllQuizzes(): Promise<IQuiz[]> {
        if (course.id == undefined) {
            loggerService.warn("Course ID undefined, can't get quizzes.");
            setLoading(false);
            return [];
        }
        loggerService.trace("Getting all quizzes of course: " + course.id);

        const request: RequestInit = RequestFactory.createGetRequest();

        return endpointsQuiz
            .getCourseQuizzes(request, course.id, undefined, "Error while getting Course quizzes")
            .then((quizzesReceived: IQuiz[]) => {
                setQuizPoolList(quizzesReceived);
                return quizzesReceived;
            })
            .finally(() => setLoading(false));
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 4,
        flexDirection: "column",
        backgroundColor: dark.theme.darkBlue1,
    },
    headContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingTop: 36,
        paddingLeft: 36,
    },
    borderContainer: {
        flex: 1,
        flexDirection: "row",
        borderBottomColor: "rgba(70,74,91,0.5)",
        borderBottomWidth: 3,
        width: "80%",
    },
    contentContainer: {
        flex: 2,
        flexDirection: "row",
        paddingLeft: "2%",
        paddingRight: "2%",
        paddingBottom: 24,
        paddingTop: 24,
    },
    contentContainerAdd: {
        flex: 1,
        backgroundColor: "rgba(1,43,86,0.5)",
        borderWidth: 3,
        borderColor: dark.theme.darkBlue3,
        marginRight: 36,
        alignItems: "center",
        maxWidth: 280,
    },
    sequenceArea: {
        flex: 1,
        backgroundColor: "rgba(1,43,86,0.5)",
        borderWidth: 3,
        borderColor: dark.theme.darkBlue3,
        marginRight: 36,
        alignItems: "stretch",
        paddingTop: 24,
    },
    courseHeader: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },
    containerCentered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    containerTop: {
        flex: 1,
        alignItems: "center",
    },
    list: {
        height: 1,
        width: "100%",
    },
    listItemTitle: {
        color: "white",
        fontWeight: "bold",
    },
    listItemSubtitle: {
        color: "white",
    },
});
