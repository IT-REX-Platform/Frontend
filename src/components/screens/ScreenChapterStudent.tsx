/* eslint-disable max-lines */
/* eslint-disable complexity */
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AVPlaybackStatus, Video } from "expo-av";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Text, Animated, SectionList } from "react-native";
import { ListItem } from "react-native-elements";
import React from "react";
import { toast } from "react-toastify";
import { RootDrawerParamList } from "../../constants/navigators/NavigationRoutes";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { IChapter } from "../../types/IChapter";
import { ICourse } from "../../types/ICourse";
import { CourseContext, LocalizationContext } from "../Context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createVideoUrl } from "../../services/createVideoUrl";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../api/endpoints/EndpointsChapter";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import { EndpointsProgress } from "../../api/endpoints/EndpointsProgress";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { ContentProgressTrackerState } from "../../constants/ContentProgressTrackerState";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { CONTENTREFERENCETYPE, IContent } from "../../types/IContent";
import { calculateVideoSize } from "../../services/calculateVideoSize";
import { LinearGradient } from "expo-linear-gradient";
import { dateConverter } from "../../helperScripts/validateCourseDates";
import ProgressService from "../../services/ProgressService";
import { ScreenQuizOverview } from "./quizzes/solveQuiz/ScreenQuizOverview";
import { EndpointsQuiz } from "../../api/endpoints/EndpointsQuiz";
import { IQuiz } from "../../types/IQuiz";
import { render } from "react-dom";

const endpointsChapter = new EndpointsChapter();
const endpointsProgress = new EndpointsProgress();

interface IVideoListSection {
    title: string;
    data: IContent[];
}

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    // Get the course of the current context and prepare the progress.
    const courseContext = React.useContext(CourseContext);
    const course = courseContext.course;
    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});

    // Setup the current chapter and the lists used.
    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterList, setChapterList] = useState<IChapter[]>([]);
    const [chapterPlaylist, setChapterPlaylist] = useState<IContent[]>([]);

    // Setup an indicator whether the video list is currently loading.
    const [isVideoListLoading, setVideoListLoading] = useState(true);

    // Update indicators for the playlist and the player's progress.
    const [playlistShouldUpdate, updatePlaylist] = useState<number>();
    const [playerShouldRestoreProgress, restorePlayerProgress] = useState<number>();

    // The current video/content item and it's title.
    const [currentVideo, setCurrentVideo] = useState<IContent>();
    const [currentTitle, setCurrentTitle] = useState<string>();

    const [currentQuiz, setCurrentQuiz] = useState<IQuiz>();

    // Setup the video section list split by due date.
    const [videoSections, setVideoSections] = useState<IVideoListSection[]>([]);

    // Setup the other contexts to use, i18n and navigation.
    React.useContext(LocalizationContext);
    const route = useRoute<ChapterContentRouteProp>();
    const chapterId = route.params.chapterId;
    const navigation = useNavigation();

    // Setup video player related variables.
    const videoPlayer = React.useRef<Video>(null);
    let timeSinceLastProgressUpdatePush = 0;

    // Map the timeperiods to intermediate objects used later.
    const timePeriods = course.timePeriods?.map((timePeriod) => {
        return {
            value: timePeriod.id,
            label: "Due on: " + dateConverter(timePeriod.endDate),
            end: timePeriod.endDate,
        };
    });

    // Render UI for video list according to un-/available video data.
    const renderVideoList = () => {
        if (isVideoListLoading) {
            // TODO: Loading indicator/style.
            return <></>;
        }
    };

    // On focus, refresh the chapter(s) and progress.
    useFocusEffect(
        React.useCallback(() => {
            console.log("%cON FOCUS CALLBACK", "color:red;");
            _getAllChapters();

            updateCourseProgress();
        }, [course])
    );

    // This effect updates whenever the progress or chapter id changes.
    useEffect(() => {
        console.log("%cCOURSE PROGRESS/CHAPTERID CALLBACK", "color:red;");
        console.log("%cnew chapter id: %s", "color:red;", chapterId);

        // Delay updating until the chapter has been received via a consumer.
        _getChapter((chapter) => {
            // Indicate an update of the playlist.
            setIndicatorForUpdate(updatePlaylist);
        });
    }, [courseProgress, chapterId]);

    // This effect updates whenever the playlist should be updated.
    useEffect(() => {
        console.log("%cPLAYLIST UPDATE CALLBACK", "color:red;");

        // Split playlist on update.
        _splitPlaylist(chapterPlaylist);

        // TODO: This is the point at which the first video is being selected. Expand for quizzez.
        const firstVideo = chapterPlaylist.find(
            (content) => content.contentReferenceType == CONTENTREFERENCETYPE.VIDEO
        );
        if (firstVideo !== undefined && (currentVideo == undefined || currentVideo.chapterId != chapterId)) {
            setCurrentVideo(firstVideo);
        }
    }, [playlistShouldUpdate]);

    // This effect updates when the current video changes.
    useEffect(() => {
        console.log("%cCURRENT VIDEO CALLBACK", "color:red;");

        // Check for the progress and update the title.
        setIndicatorForUpdate(restorePlayerProgress);
        // TODO: Real title.
        setCurrentTitle(currentVideo?.id);
        renderQuiz();
    }, [currentVideo]);

    // This efffect updates whenever the progress of a video has to be restored.
    useEffect(() => {
        console.log("%cRESTORE PROGRESS CALLBACK", "color:red;");

        if (currentVideo != undefined) restoreWatchProgress();
    }, [playerShouldRestoreProgress]);

    // Define how the playlist item renders for a content item.
    const myPlaylistItem = ({ item }: { item: IContent }) => {
        let borderColor = " ";
        let backgroundColor = " ";
        let backgroundBaseColor = " ";
        let progress = 0;

        // Set colors according to progress.
        if (
            courseProgress.id !== undefined &&
            courseProgress.contentProgressTrackers !== undefined &&
            item.id !== undefined
        ) {
            const contentProgress: IContentProgressTracker = courseProgress.contentProgressTrackers[item.id];

            if (contentProgress === undefined) {
                console.log("No content progress.");

                if (getContentDate(item.timePeriodId) == "OVERDUE") {
                    borderColor = dark.Opacity.pink;
                } else if (getContentDate(item.timePeriodId) == "SCHEDULED") {
                    borderColor = dark.Opacity.blueGreen;
                }
            } else if (contentProgress.state == ContentProgressTrackerState.STARTED) {
                console.log("Content progress started.");
                progress = getContentProgress(item, contentProgress);

                if (getContentDate(item.timePeriodId) == "OVERDUE") {
                    borderColor = dark.Opacity.pink;
                } else if (getContentDate(item.timePeriodId) == "SCHEDULED") {
                    borderColor = dark.Opacity.lightGreen;
                }

                backgroundColor = "rgba(181,239,138, 0.5)";
                backgroundBaseColor = dark.theme.darkBlue1;
            } else if (contentProgress.state == ContentProgressTrackerState.COMPLETED) {
                console.log("Content progress completed.");
                progress = getContentProgress(item, contentProgress);

                borderColor = dark.Opacity.lightGreen;
                backgroundColor = dark.Opacity.lightGreen;
                backgroundBaseColor = dark.Opacity.lightGreen;
            }
        }

        const mystyle = {
            marginBottom: "2.5%",
            borderColor: borderColor,
            borderWidth: 3,
            backgroundColor: backgroundBaseColor,
        };

        const progressStyle = {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
        };

        return (
            <ListItem containerStyle={mystyle}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={[backgroundColor, "transparent"]}
                    locations={[progress, progress]}
                    style={progressStyle}
                    end={{ x: 1.0, y: 0 }}
                />

                <TouchableOpacity
                    onPress={() => {
                        changeCurrentVideo(item);
                    }}>
                    {getContentIcon(item)}
                    <ListItem.Content>
                        <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                            {getContentName(item)}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.listItemSubtitle}>
                            {getContentSubtitle(item)}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </TouchableOpacity>
            </ListItem>
        );
    };

    return (
        <View style={styles.rootContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.iconBox} onPress={() => _gotoLastChapter()}>
                    <MaterialIcons
                        name="arrow-left"
                        size={28}
                        color="rgba(255,255,255, 1)"
                        style={[styles.icon, { justifyContent: "center" }]}
                    />
                    <Text style={[styles.chapterNavigation, { color: "rgba(255,255,255,0.8)" }]}>
                        {i18n.t("itrex.lastChapter")}{" "}
                    </Text>
                </TouchableOpacity>

                <View style={styles.iconBox}>
                    <Text style={styles.chapterHeading}>{chapter.name}</Text>
                </View>

                <TouchableOpacity style={styles.iconBox} onPress={() => _gotoNextChapter()}>
                    <Text style={[styles.chapterNavigation, { color: "rgba(255,255,255,0.8)" }]}>
                        {i18n.t("itrex.nextChapter")}{" "}
                    </Text>
                    <MaterialIcons
                        name="arrow-right"
                        size={28}
                        color="rgba(255,255,255, 1)"
                        style={[styles.icon, { justifyContent: "center" }]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.videoContainer}>
                    {currentVideo?.contentReferenceType === CONTENTREFERENCETYPE.VIDEO && (
                        <Video
                            style={styles.video}
                            ref={videoPlayer}
                            onPlaybackStatusUpdate={async (status) => heartbeat(status)}
                            source={{ uri: _getVideoUrl() }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay={false}
                            useNativeControls={true}
                        />
                    )}
                    {currentVideo?.contentReferenceType === CONTENTREFERENCETYPE.QUIZ && !!currentQuiz && (
                        <ScreenQuizOverview quiz={currentQuiz}></ScreenQuizOverview>
                    )}
                    <View style={styles.iconContainer}>
                        <Text style={[styles.videoTitle, { paddingTop: "1.5%" }]}>{currentTitle}</Text>
                    </View>
                </View>

                <View style={styles.playlistContainer}>
                    {renderVideoList()}
                    <Animated.View style={{ flex: 1, maxWidth: "95%" }}>
                        <SectionList
                            style={styles.playlist}
                            sections={videoSections}
                            showsVerticalScrollIndicator={true}
                            renderItem={myPlaylistItem}
                            extraData={playlistShouldUpdate}
                            keyExtractor={(item) => item.id ?? ""}
                            ListEmptyComponent={<Text>Videos here</Text>}
                            renderSectionHeader={({ section }) =>
                                section.data.length > 0 ? (
                                    <Text style={[styles.listItemSubtitle, { marginTop: 5 }]}>{section.title}</Text>
                                ) : null
                            }
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );

    /** Sets the given update indictor to a new number to trigger an update. */
    function setIndicatorForUpdate(indicatorSetter: React.Dispatch<React.SetStateAction<number | undefined>>) {
        indicatorSetter(Date.now);
    }

    /** Get the corresponding icon for a content item. */
    function getContentIcon(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                return <MaterialCommunityIcons name="video-vintage" size={28} color="white" />;

            case CONTENTREFERENCETYPE.QUIZ:
                return <MaterialCommunityIcons name="file-question-outline" size={28} color="white" />;

            default:
                return <></>;
        }
    }

    /** Gets the name of a content item. */
    function getContentName(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                return <Text>{item.id}</Text>;
            case CONTENTREFERENCETYPE.QUIZ:
                return <Text>{item.id}</Text>;
            default:
                return <></>; // TODO: Add an error maybe?
        }
    }

    /** Returns a fitting subtitle for the given content item per type. */
    function getContentSubtitle(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                return (
                    <Text>
                        {i18n.t("itrex.videoDuration")}
                        {calculateVideoSize(item.video?.length)}
                    </Text>
                );
            case CONTENTREFERENCETYPE.QUIZ:
                return (
                    <Text>
                        {i18n.t("itrex.questions")} {item.quiz?.questions.length}
                    </Text>
                );
            default:
                return <></>;
        }
    }

    /** Returns the content progress as a percent value for a item and its content progress tracker. */
    function getContentProgress(item: IContent, contentProgress: IContentProgressTracker) {
        let itemProgress = 0;

        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                if (contentProgress.state == "COMPLETED") {
                    itemProgress = 1;
                } else {
                    itemProgress = item.video?.length / contentProgress.progress;
                }
                break;

            case CONTENTREFERENCETYPE.QUIZ:
                if (contentProgress.state == "COMPLETED") {
                    itemProgress = 1;
                } else {
                    itemProgress = 0;
                }
        }

        return itemProgress;
    }

    /** Returns a string with info about the date of the given content item (by id). */
    function getContentDate(contentID: string) {
        const contentDate = timePeriods?.find((element) => element.value == contentID);
        const currentDate = new Date();

        if (contentDate?.end === undefined) {
            return " ";
        } else if (contentDate?.end < currentDate) {
            return "OVERDUE";
        } else if (contentDate?.end >= currentDate) {
            return "SCHEDULED";
        }
    }

    /** Splits the playlist according to the defined weeks in the time periods. */
    function _splitPlaylist(contentList: IContent[]) {
        const videoWeekSections: IVideoListSection[] = [];

        if (timePeriods == undefined) {
            return;
        }

        // Prepare each section to add videos to.
        for (const time of timePeriods) {
            videoWeekSections.push({ title: time.label, data: [] });
        }

        // Split the content list accordingly.
        for (const curContent of contentList) {
            // Get timeperiod's title for the current content.
            const weekTitle = timePeriods.find((timePeriod) => timePeriod.value === curContent.timePeriodId)?.label;
            // Add the content to its data array.
            videoWeekSections.find((date) => date.title == weekTitle)?.data.push(curContent);
        }

        // And set it.
        setVideoSections(videoWeekSections);
    }

    /** Performs the heartbeat with the video player. */
    async function heartbeat(status: AVPlaybackStatus) {
        if (currentVideo == undefined) {
            return;
        }

        if (status["isLoaded"] == true) {
            timeSinceLastProgressUpdatePush = timeSinceLastProgressUpdatePush + status["progressUpdateIntervalMillis"];

            if (timeSinceLastProgressUpdatePush >= 2500) {
                timeSinceLastProgressUpdatePush = 0;

                const progress: number = Math.floor(status["positionMillis"] * 0.001);
                ProgressService.getInstance().updateContentProgress(
                    course.id,
                    currentVideo,
                    progress,
                    (newContentProgress, hasCreated) => {
                        // TODO: This should only update on hasCreated, but if we do
                        //       not update otherwise, we lose the last written progress
                        //       in our local instance.
                        /*if (hasCreated)*/
                        updateCourseProgress();
                    }
                );

                setVideoCompletedIfNecessary(currentVideo, status);
            }
        }
    }

    /** Sets the video progress as completed if it matches the criteria. */
    async function setVideoCompletedIfNecessary(contentRef: IContent, status: AVPlaybackStatus) {
        const contentProgress: IContentProgressTracker = courseProgress.contentProgressTrackers[contentRef.id];
        if (contentProgress != undefined && contentProgress.state != ContentProgressTrackerState.COMPLETED) {
            const position = status["positionMillis"];
            const duration = status["durationMillis"];
            if (duration != undefined && position + 15000 > duration) {
                completeVideo(contentRef);
            }
        }
    }

    /** Restores the watch progress of the current video. */
    function restoreWatchProgress() {
        if (
            courseProgress == undefined ||
            courseProgress.contentProgressTrackers == undefined ||
            currentVideo == undefined ||
            currentVideo.id == undefined
        ) {
            return;
        }
        let progress = courseProgress.contentProgressTrackers[currentVideo.id]?.progress;
        if (progress == undefined) progress = 0;
        videoPlayer.current?.setPositionAsync(progress * 1000);
    }

    /** Update the course progress and re-set it to the state. */
    function updateCourseProgress() {
        if (course.id === undefined) {
            return;
        }

        const progressRequest: RequestInit = RequestFactory.createGetRequest();
        endpointsProgress
            .getCourseProgress(progressRequest, course.id, undefined, i18n.t("itrex.getCourseProgressError"))
            .then((receivedProgress) => setCourseProgress(receivedProgress));
    }

    /** Updates a video to the complete status. */
    async function completeVideo(contentRef: IContent) {
        ProgressService.getInstance().completeContentProgress(course.id, contentRef, (receivedProgress) => {
            updateCourseProgress();
        });
    }

    /** Gets all the chapters of the current course. */
    function _getAllChapters() {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsChapter.getAllChapters(request).then((chaptersReceived) => {
            setChapterList(
                chaptersReceived.filter((chap) => {
                    if (chap.courseId == course.id) {
                        return chap;
                    }
                })
            );
        });
    }

    /** Gets the chapter with the current id. Provides a consumer to execute once it has been received. */
    function _getChapter(consumer: (chapter: IChapter) => void) {
        const request: RequestInit = RequestFactory.createGetRequest();

        setVideoListLoading(true);

        endpointsChapter
            .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
            .then((chapterReceived) => {
                setChapter(chapterReceived);
                if (chapterReceived.contentReferences !== undefined) {
                    setChapterPlaylist(chapterReceived.contentReferences);

                    // Call a delayed consumer once everything has been finished.
                    consumer(chapterReceived);
                }
            })
            .finally(async () => setVideoListLoading(false));
    }

    /** Changes the current chapter to the next chapter in line. */
    function _gotoNextChapter() {
        let chapterIndex = chapterList.findIndex((i) => i.id == chapterId);
        //const chaindex = chapter.findIndex((x) => x.value == question?.type);

        console.log("ChapterIndex:");
        console.log(chapterIndex);

        if (chapterList !== undefined) {
            (chapterIndex = chapterIndex + 1), console.log("IF Chapter List Not undefined:");
            console.log(chapterIndex);
            if (chapterList[chapterIndex] == undefined) {
                navigation.navigate("ROUTE_COURSE_DETAILS", {
                    screen: "INFO",
                    params: { courseId: course.id, screen: "OVERVIEW" },
                });
                return;
            }

            navigation.navigate("CHAPTER_CONTENT", {
                chapterId: chapterList[chapterIndex].id,
            });
        }
    }

    /** Changes the current chapter to the previous chapter in line. */
    function _gotoLastChapter() {
        let chapterIndex = chapterList.findIndex((i) => i.id == chapterId);
        //const chaindex = chapter.findIndex((x) => x.value == question?.type);

        console.log("ChapterIndex:");
        console.log(chapterIndex);

        if (chapterList !== undefined) {
            (chapterIndex = chapterIndex - 1), console.log("IF Chapter List Not undefined:");
            console.log(chapterIndex);

            if (chapterList[chapterIndex] == undefined) {
                navigation.navigate("ROUTE_COURSE_DETAILS", {
                    screen: "INFO",
                    params: { courseId: course.id, screen: "OVERVIEW" },
                });
                return;
            }
            navigation.navigate("CHAPTER_CONTENT", {
                chapterId: chapterList[chapterIndex].id,
            });
        }
    }

    /** Creates a video url for the current video. */
    function _getVideoUrl(): string {
        const vidId = currentVideo?.contentId;

        if (videoSections == undefined || videoSections == undefined || null) {
            toast.error(i18n.t("itrex.videoNotFound"));
            return "";
        }

        return createVideoUrl(vidId);
    }

    /** Changes the current video to the given new content. */
    function changeCurrentVideo(vid?: IContent) {
        if (vid !== undefined) {
            setCurrentVideo(vid);
            _getVideoUrl();
        }
    }

    function renderQuiz() {
        if (currentVideo?.contentReferenceType !== CONTENTREFERENCETYPE.QUIZ) {
            return undefined;
        }
        if (currentVideo?.contentId !== undefined) {
            const endpointsQuiz = new EndpointsQuiz();
            const request: RequestInit = RequestFactory.createGetRequest();
            const response = endpointsQuiz.getQuiz(request, currentVideo.contentId);
            response.then((quizResponse) => {
                if (quizResponse !== undefined) {
                    setCurrentQuiz(quizResponse);
                }
            });
        }
    }
};

const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: dark.theme.darkBlue1,
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "3%",
    },

    headerContainer: {
        flexDirection: "row",
        alignItems: "center",

        paddingBottom: "3%",
        justifyContent: "space-between",
    },

    chapterNavigation: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },

    contentContainer: {
        flexDirection: "row",
        alignContent: "center",
    },

    videoContainer: {
        flex: 3,
        alignSelf: "flex-start",
    },

    playlistContainer: {
        flex: 1,
        alignSelf: "flex-start",
        paddingStart: "1.5%",
    },

    videoTitle: {
        color: "white",
        fontSize: 18,
        paddingRight: "20px",
    },
    video: {
        //borderColor: dark.theme.darkBlue2,
        //borderWidth: 3,
        marginTop: 20,
        width: "100%",
        height: "auto",
    },

    videoListDownloadingContainer: {},
    loadingIcon: {},

    progressBar: {
        height: 20,
        width: "100%",
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        margin: 50,
    },
    progressLabels: {
        padding: 5,
        color: "white",
        fontWeight: "bold",
    },

    iconContainer: {
        flex: 1,
        flexDirection: "row-reverse",
        justifyContent: "flex-end",
        borderColor: dark.theme.grey,
        borderBottomWidth: 1.5,
        padding: "0.5%",
    },

    iconBox: {
        flexDirection: "row",
        paddingLeft: "1%",
        padding: "0.5%",
    },

    icon: {
        position: "relative",
    },

    playlist: {
        marginTop: 20,
    },

    chapterHeading: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: "1.5%",
    },

    textIcon: {
        color: "rgba(255,255,255,0.66)",
        textAlign: "left",
        alignSelf: "center",
        margin: 5,
    },

    listItemTitle: {
        color: "white",
        textAlign: "left",
        marginBottom: 5,
        marginRight: 5,
    },

    listItemSubtitle: {
        color: "rgba(255,255,255,0.66)",
        textAlign: "left",
    },

    listItemTitleChanged: {
        color: "white",
        textAlign: "left",
        marginBottom: 5,
        marginRight: 5,
    },

    listItemSubtitleChanged: {
        color: dark.theme.pink,
        textAlign: "left",
    },
});
