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
import { AVPlaybackSource } from "expo-av/build/AV";
import { ScreenQuizOverview } from "./quizzes/solveQuiz/ScreenQuizOverview";
import { EndpointsQuiz } from "../../api/endpoints/EndpointsQuiz";
import { IQuiz } from "../../types/IQuiz";

const endpointsChapter = new EndpointsChapter();
const endpointsProgress = new EndpointsProgress();

interface IVideoListSection {
    title: string;
    data: IContent[];
}

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    // Setup the main contexts to use, i18n and navigation.
    React.useContext(LocalizationContext);
    const navigation = useNavigation();
    const route = useRoute<ChapterContentRouteProp>();
    const chapterId = route.params.chapterId;

    // Get the course of the current context and prepare the progress.
    const courseContext = React.useContext(CourseContext);
    const course = courseContext.course;
    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});

    // Setup the current chapter and the lists used.
    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterList, setChapterList] = useState<IChapter[]>([]);
    const [chapterPlaylist, setChapterPlaylist] = useState<IContent[]>([]);

    // Update indicators for the playlist and the player's progress.
    const [playlistShouldUpdate, updatePlaylist] = useState<number>();
    const [playerShouldRestoreProgress, restorePlayerProgress] = useState<number>();

    // The current video/content item and it's title.
    const [currentVideo, setCurrentVideo] = useState<IContent>();
    const [currentTitle, setCurrentTitle] = useState<string>();
    const [currentPlaybackSource, setPlaybackSource] = useState<AVPlaybackSource>();

    const [currentQuiz, setCurrentQuiz] = useState<IQuiz>();

    // Setup the video section list split by due date.
    const [videoSections, setVideoSections] = useState<IVideoListSection[]>([]);

    // Setup video player related variables.
    const videoPlayer = React.useRef<Video>(null);
    let timeSinceLastProgressUpdatePush = 0;

    // Map the timeperiods to intermediate objects used later.
    const timePeriods = course.timePeriods?.map((timePeriod) => {
        return {
            value: timePeriod.id,
            label: dateConverter(timePeriod.endDate),
            end: timePeriod.endDate,
        };
    });

    // Focus Effect: Refresh the chapter(s) and progress.
    useFocusEffect(
        React.useCallback(() => {
            console.log("%cOn Focus Effect Callback", "color:yellow;");

            // Update the chapter list with the chapters of the course, if any.
            if (course.chapters !== undefined) {
                setChapterList(course.chapters);
            }

            updateCourseProgress(() => {
                setIndicatorForUpdate(restorePlayerProgress);
            });
        }, [course])
    );

    // Effect: Sync everything to the current/new chapter.
    useEffect(() => {
        console.log("%cOn ChapterId Effect", "color:cyan;");

        syncToCurrentChapter();
        setIndicatorForUpdate(updatePlaylist);
    }, [chapterId]);

    // Effect: On progress changes trigger a playlist update.
    useEffect(() => {
        console.log("%cOn Course Progress effect.", "color:red;");

        setIndicatorForUpdate(updatePlaylist);
    }, [courseProgress]);

    // Effect: Playlist should refresh, so update the sections and refresh the video if none.
    useEffect(() => {
        console.log("%cOn Playlist Should Update effect.", "color:green;");

        // Split playlist on update.
        makePlaylistSections(chapterPlaylist);

        // TODO: This is the point at which the first video is being selected. Expand for quizzez.
        const firstVideo = chapterPlaylist.find(
            (content) => content.contentReferenceType === CONTENTREFERENCETYPE.VIDEO
        );
        if (firstVideo !== undefined && (currentVideo === undefined || currentVideo.chapterId !== chapterId)) {
            setCurrentVideo(firstVideo);
        }
    }, [playlistShouldUpdate]);

    // Effect: Update the title and restore the video's progress when the current video changes.
    useEffect(() => {
        console.log("%cOn Current Video effect.", "color:orange;");

        // Check for the progress and update the title.
        if (currentVideo === undefined) {
            console.log("video set to undefined");
            return;
        }

        setPlaybackSource({ uri: getCurrentVideoUrl() });
        setIndicatorForUpdate(restorePlayerProgress);

        switch (currentVideo.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                setCurrentTitle(currentVideo.video?.title ?? currentVideo.id);
                break;
            case CONTENTREFERENCETYPE.QUIZ:
                setCurrentTitle(currentVideo.quiz?.name ?? currentVideo.id);
                break;
        }

        renderQuiz();
    }, [currentVideo]);

    // Effect: Whenever the progress of a video has to be restored and there is a video, do it.
    useEffect(() => {
        console.log("%cOn Should Restore Progress effect.", "color:purple;");

        restoreWatchProgress();
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
            console.log("Check progress for current playlist item.");

            if (contentProgress === undefined) {
                if (getContentDate(item.timePeriodId) == "OVERDUE") {
                    borderColor = dark.Opacity.pink;
                } else if (getContentDate(item.timePeriodId) == "SCHEDULED") {
                    borderColor = dark.Opacity.blueGreen;
                }
            } else if (contentProgress.state == ContentProgressTrackerState.STARTED) {
                progress = getContentProgress(item, contentProgress);

                if (getContentDate(item.timePeriodId) == "OVERDUE") {
                    borderColor = dark.Opacity.pink;
                } else if (getContentDate(item.timePeriodId) == "SCHEDULED") {
                    borderColor = dark.Opacity.lightGreen;
                }

                backgroundColor = "rgba(181,239,138, 0.5)";
                backgroundBaseColor = dark.theme.darkBlue1;
            } else if (contentProgress.state == ContentProgressTrackerState.COMPLETED) {
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
                        if (item !== undefined) {
                            setCurrentVideo(item);
                        }
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
                <TouchableOpacity style={styles.iconBox} onPress={() => gotoPreviousChapter()}>
                    <MaterialIcons
                        name="arrow-left"
                        size={28}
                        color="rgba(255,255,255, 1)"
                        style={[styles.icon, { justifyContent: "center" }]}
                    />
                    <Text style={[styles.chapterNavigation, { color: "rgba(255,255,255,0.8)" }]}>
                        {getCurrentChapterIndex() === 0
                            ? i18n.t("itrex.chapterBackToOverview")
                            : i18n.t("itrex.lastChapter")}
                    </Text>
                </TouchableOpacity>

                <View style={styles.iconBox}>
                    <Text style={styles.chapterHeading}>{chapter.name}</Text>
                </View>

                <TouchableOpacity style={styles.iconBox} onPress={() => gotoNextChapter()}>
                    <Text style={[styles.chapterNavigation, { color: "rgba(255,255,255,0.8)" }]}>
                        {getCurrentChapterIndex() === chapterList.length - 1
                            ? i18n.t("itrex.chapterBackToOverview")
                            : i18n.t("itrex.nextChapter")}
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
                            onLoad={(status) => restoreWatchProgress()}
                            source={currentPlaybackSource}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay={false}
                            useNativeControls={true}
                        />
                    )}
                    {currentVideo?.contentReferenceType === CONTENTREFERENCETYPE.QUIZ && !!currentQuiz && (
                        <ScreenQuizOverview quiz={currentQuiz} chapterId={chapterId}></ScreenQuizOverview>
                    )}
                    <View style={styles.iconContainer}>
                        <Text style={[styles.videoTitle, { paddingTop: "1.5%" }]}>{currentTitle}</Text>
                    </View>
                </View>

                <View style={styles.playlistContainer}>
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
                                    <Text style={[styles.listItemSubtitle, { marginTop: 5 }]}>
                                        {i18n.t("itrex.contentProgressDueTo")} {section.title}
                                    </Text>
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
                return <Text>{item.video?.title ?? item.id}</Text>;
            case CONTENTREFERENCETYPE.QUIZ:
                return <Text>{item.quiz?.name ?? item.id}</Text>;
            default:
                return <></>; // TODO: Add an error maybe?
        }
    }

    /** Returns a fitting subtitle for the given content item per type. */
    function getContentSubtitle(item: IContent) {
        switch (item.contentReferenceType) {
            case CONTENTREFERENCETYPE.VIDEO:
                // TODO: This is not the actual duration, but file size. For now, display nothing.
                // {i18n.t("itrex.videoDuration")} {calculateVideoSize(item.video?.length)}
                return <></>;

            case CONTENTREFERENCETYPE.QUIZ:
                // TODO: Number of questions are not being fetched correctly yet.
                return (
                    <Text>
                        {i18n.t("itrex.questions")} {item.quiz?.questions.length ?? "Unknown"}
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
                if (contentProgress.state === ContentProgressTrackerState.COMPLETED) {
                    itemProgress = 1;
                } else {
                    itemProgress = contentProgress.progress ?? 0;
                }
                break;

            case CONTENTREFERENCETYPE.QUIZ:
                if (contentProgress.state === ContentProgressTrackerState.COMPLETED) {
                    itemProgress = 1;
                } else {
                    itemProgress = 0;
                }
                break;
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
    function makePlaylistSections(contentList: IContent[]) {
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
            videoWeekSections.find((date) => date.title === weekTitle)?.data.push(curContent);
        }

        // And set it.
        setVideoSections(videoWeekSections);
    }

    /** Performs the heartbeat with the video player. */
    async function heartbeat(status: AVPlaybackStatus) {
        if (currentVideo == undefined) {
            return;
        }

        if (status.isLoaded) {
            timeSinceLastProgressUpdatePush = timeSinceLastProgressUpdatePush + status.progressUpdateIntervalMillis;

            if (timeSinceLastProgressUpdatePush >= 2500) {
                timeSinceLastProgressUpdatePush = 0;

                if (status.durationMillis !== undefined && status.durationMillis > 0) {
                    const progress = status.positionMillis / status.durationMillis;

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
                }

                setVideoCompletedIfNecessary(currentVideo, status);
            }
        }
    }

    /** Restores the watch progress of the current video. */
    function restoreWatchProgress() {
        if (
            courseProgress === undefined ||
            courseProgress.contentProgressTrackers === undefined ||
            currentVideo === undefined ||
            currentVideo.id === undefined
        ) {
            return;
        }

        const progress = courseProgress.contentProgressTrackers[currentVideo.id]?.progress ?? 0;

        const vidPlayerInst = videoPlayer.current;
        vidPlayerInst?.getStatusAsync().then((status) => {
            if (status.isLoaded) {
                const millisToSet = progress * (status.durationMillis ?? 0);
                if (!isNaN(millisToSet)) {
                    vidPlayerInst.setPositionAsync(millisToSet);
                }
            }
        });
    }

    /** Sets the video progress as completed if it matches the criteria. */
    async function setVideoCompletedIfNecessary(contentRef: IContent, status: AVPlaybackStatus) {
        const contentProgress: IContentProgressTracker = courseProgress.contentProgressTrackers[contentRef.id];

        if (
            contentProgress !== undefined &&
            contentProgress.state !== ContentProgressTrackerState.COMPLETED &&
            status.isLoaded
        ) {
            const position = status.positionMillis;
            const duration = status.durationMillis;
            if (duration !== undefined && position + 15000 > duration) {
                completeVideo(contentRef);
            }
        }
    }

    /** Updates a video to the complete status. */
    async function completeVideo(contentRef: IContent) {
        if (course.id === undefined) {
            return;
        }

        ProgressService.getInstance().completeContentProgress(course.id, contentRef, (receivedProgress) => {
            updateCourseProgress();
        });
    }

    /** Update the course progress and re-set it to the state. */
    function updateCourseProgress(
        consumer: (courseProgress: ICourseProgressTracker) => void = () => {
            /*empty default*/
        }
    ) {
        if (course.id === undefined) {
            return;
        }

        ProgressService.getInstance().updateCourseProgressFor(course.id, (receivedProgress) => {
            setCourseProgress(receivedProgress);
            consumer(courseProgress);
        });
    }

    /** Gets the chapter with the current id. Provides a consumer to execute once it has been received. */
    function syncToCurrentChapter() {
        const currChapter = course.chapters?.find((chpt: IChapter) => {
            return chpt?.id === chapterId;
        });
        console.log("CurrChapter:");
        console.log(currChapter);

        if (currChapter === undefined) {
            return;
        }
        setChapter(currChapter);

        if (currChapter.contentReferences !== undefined) {
            setChapterPlaylist(currChapter.contentReferences);
        }
    }

    /** Returns the index of the current chapter in the list. */
    function getCurrentChapterIndex() {
        return chapterList.findIndex((i) => i.id === chapterId);
    }

    /** Changes the current chapter to the next chapter in line. */
    function gotoNextChapter() {
        moveToChapter(1);
    }

    /** Changes the current chapter to the previous chapter in line. */
    function gotoPreviousChapter() {
        moveToChapter(-1);
    }

    /** Moves to a chapter relative to the current one by an index offset. Moves to course details if none is found. */
    function moveToChapter(indexOffset: number): void {
        if (chapterList === undefined) {
            return;
        }

        let chapterIndex = getCurrentChapterIndex();
        chapterIndex += indexOffset;

        if (chapterList[chapterIndex] === undefined) {
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

    /** Creates a video url for the current video. */
    function getCurrentVideoUrl(): string {
        const vidId = currentVideo?.contentId;

        if (vidId === undefined) {
            toast.error(i18n.t("itrex.videoNotFound"), { autoClose: 2000 });
            return "";
        }

        return createVideoUrl(vidId);
    }

    /** Sets the current component to a quiz if it is selected.  */
    function renderQuiz() {
        if (currentVideo?.contentReferenceType !== CONTENTREFERENCETYPE.QUIZ) {
            return;
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
