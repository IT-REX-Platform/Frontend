import { DarkTheme, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AVPlaybackStatus, Video } from "expo-av";
import { useEffect, useState } from "react";
import {
    Button,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
    Animated,
    StyleProp,
    ViewStyle,
    SectionList,
    ImageBackgroundBase,
    ImageBackground,
} from "react-native";
import { ListItem } from "react-native-elements";
import React from "react";
import { toast } from "react-toastify";
import { EndpointsVideo } from "../../api/endpoints/EndpointsVideo";
import { RootDrawerParamList } from "../../constants/navigators/NavigationRoutes";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { IChapter } from "../../types/IChapter";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { CourseContext, LocalizationContext } from "../Context";
import { MaterialCommunityIcons, MaterialIcons, Foundation } from "@expo/vector-icons";
import { createVideoUrl } from "../../services/createVideoUrl";
//import { ScreenCourseTabsNavigationProp, ScreenCourseTabsRouteProp } from "../../course/ScreenCourseTabs";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../api/endpoints/EndpointsChapter";
import { Icon } from "react-native-vector-icons/Icon";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import useStateWithCallback from "use-state-with-callback";
import { EndpointsProgress } from "../../api/endpoints/EndpointsProgress";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { ContentProgressTrackerState } from "../../constants/ContentProgressTrackerState";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { CONTENTREFERENCETYPE, IContent } from "../../types/IContent";
import { calculateVideoSize } from "../../services/calculateVideoSize";
import { LinearGradient } from "expo-linear-gradient";
import { render } from "react-dom";
import { borderRadius } from "react-select/src/theme";
import { waitFor } from "@testing-library/react-native";
import { TextButton } from "../uiElements/TextButton";
import { dateConverter } from "../../helperScripts/validateCourseDates";
import { emptyString } from "react-select/src/utils";
import { ProgressBar } from "react-native-paper";
import { black } from "react-native-paper/lib/typescript/styles/colors";
import { BackgroundImage } from "react-native-elements/dist/config";

const endpointsVideo = new EndpointsVideo();
const endpointsChapter = new EndpointsChapter();
const endpointsProgress = new EndpointsProgress();
const endpointsCourse = new EndpointsCourse();

interface IVideoListSection {
    title: string;
    data: IContent[];
}

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    const course: ICourse = React.useContext(CourseContext);
    console.log("KursID:");
    console.log(course.id);
    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});

    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterList, setChapterList] = useState<IChapter[]>([]);
    const [chapterPlaylist, setChapterPlaylist] = useState<IContent[]>([]);

    const initialVideoState: IVideo[] = [];
    const [isVideoListLoading, setVideoListLoading] = useState(true);
    //Store URL of Current Video here:

    // update indicators
    const [playlistShouldUpdate, updatePlaylist] = useState<number>();
    const [playerShouldRestoreProgress, restorePlayerProgress] = useState<number>();

    let [currentVideo, setCurrentVideo] = useState<IContent>();

    const [videos, setVideos] = useState<IVideoListSection[]>([]);
    //let video: IVideo

    //Vertical slide animation for FlatList.
    let translateY = new Animated.Value(50);
    Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: false }).start();

    React.useContext(LocalizationContext);
    const route = useRoute<ChapterContentRouteProp>();
    const chapterId = route.params.chapterId;
    const navigation = useNavigation();

    const videoPlayer = React.useRef<Video>(null);
    let timeSinceLastProgressUpdatePush: number = 0;

    const timePeriods = course.timePeriods?.map((timePeriod, idx) => {
        return {
            value: timePeriod.id,
            label: "Due on: " + dateConverter(timePeriod.endDate),

            //dateConverter(timePeriod.startDate) +
            //" - " +
            //dateConverter(timePeriod.endDate),

            //i18n.t("itrex.week") + " " + (idx + 1),
            //+ " (" +
            //dateConverter(timePeriod.startDate) +
            //" - " +
            //dateConverter(timePeriod.endDate) +
            //")",
        };
    });

    // Render UI for video list according to un-/available video data.
    const renderVideoList = () => {
        if (isVideoListLoading) {
            return (
                <View style={styles.videoListDownloadingContainer}>
                    <ActivityIndicator style={styles.loadingIcon} size="large" color="white" />
                </View>
            );
        }
    };

    // Call following function/s only once when this screen is shown.
    useFocusEffect(
        React.useCallback(() => {
            console.log("In Callback");
            _getAllChapters();

            updateCourseProgress();

            /*const progressRequest: RequestInit = RequestFactory.createGetRequest();
            endpointsProgress
                .getCourseProgress(progressRequest, course.id, undefined, i18n.t("itrex.getCourseProgressError"))
                .then((receivedProgress) => {
                    console.log("Progress of course Init:");
                    console.log(receivedProgress);
                    setCourseProgress(receivedProgress);
                });*/
        }, [course])
    );

    useEffect(() => {
        _getChapter();
        //_getAllVideos();
        _splitPlaylist(chapterPlaylist);
        setIndicatorForUpdate(updatePlaylist);
    }, [courseProgress, chapterId]);

    useEffect(() => {
        if (chapterPlaylist.length > 0 && currentVideo == undefined) {
            setCurrentVideo(chapterPlaylist[0]);
        }
    }, [playlistShouldUpdate]);

    useEffect(() => {
        setIndicatorForUpdate(restorePlayerProgress);
    }, [currentVideo]);

    useEffect(() => {
        if (currentVideo != undefined) restoreWatchProgress();
    }, [playerShouldRestoreProgress]);

    const myPlaylistItem = ({ item }: { item: IContent }) => {
        let brd: string = " ";
        let bck: string = " ";
        let progress: number = 1;

        console.log("RenderItemID");
        console.log(item.id);

        console.log("Entered thisPlaylistItem");

        if (
            courseProgress.id !== undefined &&
            courseProgress.contentProgressTrackers !== undefined &&
            item.id !== undefined
        ) {
            console.log("PlaylistItem first If");
            console.log(
                courseProgress.id !== undefined &&
                    courseProgress.contentProgressTrackers !== undefined &&
                    item.id !== undefined
            );
            const contentProgress: IContentProgressTracker = courseProgress.contentProgressTrackers[item.id];
            const progressRequest: RequestInit = RequestFactory.createGetRequest();

            if (contentProgress == undefined) {
                console.log("If contentProgress undefined:");
                console.log(contentProgress == undefined);

                //if (item.timePeriodId)

                brd = dark.Opacity.blueGreen;
            } else if (contentProgress.state == ContentProgressTrackerState.STARTED) {
                if (contentProgress.id === undefined) {
                    return " ";
                }
                endpointsProgress
                    .getContentProgress(progressRequest, contentProgress.id, undefined, "getContentProgressError")
                    .then((receivedProgress) => {
                        console.log("New Progress");
                        console.log(receivedProgress);
                    });

                console.log("Else If contentProgress Started:");
                console.log(contentProgress.state == ContentProgressTrackerState.STARTED);
                //progress = contentProgress.progress?.toString+"%";
                progress = contentProgress.progress / 100;
                console.log("Progress:");
                console.log(progress);

                brd = dark.Opacity.lightGreen;
                bck = "rgba(181,239,138, 0.5)";
            } else if (contentProgress.state == ContentProgressTrackerState.COMPLETED) {
                if (contentProgress.id === undefined) {
                    return " ";
                }
                endpointsProgress
                    .getContentProgress(progressRequest, contentProgress.id, undefined, "getContentProgressError")
                    .then((receivedProgress) => {
                        console.log("New Progress");
                        console.log(receivedProgress);
                    });

                console.log("Else If contentProgress Completed:");
                console.log(contentProgress.state == ContentProgressTrackerState.COMPLETED);

                progress = contentProgress.progress / 100;
                console.log("Progress:");
                console.log(progress);

                brd = dark.Opacity.lightGreen;
                bck = dark.Opacity.lightGreen;
            }
        }

        const mystyle = {
            marginBottom: "2.5%",
            borderColor: brd,
            borderWidth: 3,
            backgroundColor: dark.theme.darkBlue1,
        };

        const progressStyle = {
            // backgroundColor: bck,

            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
            //transform: [{ rotateY: "90deg"}],
        };

        return (
            <ListItem containerStyle={mystyle}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={[bck, "transparent"]}
                    locations={[progress, progress]}
                    style={progressStyle}
                    end={{ x: 1.0, y: 0 }}
                />

                <TouchableOpacity
                    onPress={() => {
                        changeCurrentVideo(item);
                        changeVideoProgress(item);
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
                        // onLoad={changeVideoProgress()}
                    />
                    <View style={styles.iconContainer}>
                        <Text style={[styles.videoTitle, { paddingTop: "1.5%" }]}>Ch1.: My Video</Text>
                    </View>
                </View>

                <View style={styles.playlistContainer}>
                    {renderVideoList()}
                    <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                        <SectionList
                            style={styles.playlist}
                            //data={videos}
                            sections={videos}
                            showsVerticalScrollIndicator={true}
                            renderItem={myPlaylistItem}
                            //ListHeaderComponent={<Text style={styles.videoTitle}>Playlist</Text>}
                            //renderItem={thisPlaylistItem}
                            extraData={playlistShouldUpdate}
                            keyExtractor={(item) => item.id ?? ""}
                            ListEmptyComponent={<Text>Videos here</Text>}
                            renderSectionHeader={
                                ({ section }) =>
                                    section.data.length > 0 ? (
                                        <Text style={[styles.listItemSubtitle, { marginTop: 5 }]}>{section.title}</Text>
                                    ) : null
                                //renderSectionHeader={({ section: { title } }) => (
                                //  <Text style={styles.chapterHeading}>{title}</Text>
                            }
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );

    function setIndicatorForUpdate(indicatorSetter: React.Dispatch<React.SetStateAction<number | undefined>>) {
        indicatorSetter(Date.now);
    }

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
        }
    }

    function _getProgressPercent(content: IContentProgressTracker) {
        if (content.id === undefined || content === undefined) {
            return;
        }

        const contentID = content.id;

        const progressRequest: RequestInit = RequestFactory.createGetRequest();
        endpointsProgress
            .getContentProgress(progressRequest, contentID, undefined, "getContentProgressError")
            .then((progress) => {
                return progress?.progress?.toString + "%";
            });

        //const progressRequest: RequestInit = RequestFactory.createGetRequest();
        //endpointsProgress.getContentProgress(progressRequest, content.id, undefined, i18n.t("itrex.getCourseProgressError") )
        //.then( (progress) => {return progress?.toString + "%"})
    }

    function _splitPlaylist(pl: IContent[]) {
        let weeks: IVideoListSection[] = [];

        if (timePeriods == undefined) {
            console.log("Time Periods undefined");
            console.log(timePeriods);
            return;
        }

        for (const time of timePeriods) {
            weeks.push({ title: time.label, data: [] });

            // let time = pl[cont].timePeriodId;
        }

        for (const cont of pl) {
            // Get time period  and title of content from time periods
            const week = timePeriods?.find((timePeriod) => timePeriod.value === cont.timePeriodId)?.label;
            weeks.find((date) => date.title == week)?.data.push(cont);
            // Write Content in right week

            // Sectiontitle: Week
            // Sectiondata: data[]
        }

        setVideos(weeks);

        //setVideos(weeks.filter(((abc: IVideoListSection)=>
        //   {if (abc.data !== undefined) {return abc}})));
    }

    async function heartbeat(status: AVPlaybackStatus) {
        if (currentVideo == undefined) {
            return;
        }

        if (status["isLoaded"] == true) {
            timeSinceLastProgressUpdatePush = timeSinceLastProgressUpdatePush + status["progressUpdateIntervalMillis"];

            if (timeSinceLastProgressUpdatePush >= 2500) {
                timeSinceLastProgressUpdatePush = 0;

                await createContentProgressIfNecessary(currentVideo).then(async () => {
                    changeVideoWatchProgress(currentVideo, Math.floor(status["positionMillis"] * 0.001));
                    setVideoCompletedIfNecessary(currentVideo, status);
                });
            }
        }
    }

    async function createContentProgressIfNecessary(contentRef: IContent) {
        const contentProgress = courseProgress.contentProgressTrackers[contentRef.id];
        if (contentProgress === undefined || contentProgress.id === undefined) {
            await changeVideoProgress(contentRef);
        }
    }

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

    function updateCourseProgress() {
        if (course.id === undefined) {
            return;
        }

        const progressRequest: RequestInit = RequestFactory.createGetRequest();
        endpointsProgress
            .getCourseProgress(progressRequest, course.id, undefined, i18n.t("itrex.getCourseProgressError"))
            .then((receivedProgress) => setCourseProgress(receivedProgress));
    }

    async function changeVideoProgress(contentRef: IContent) {
        // TODO: Adjust and/or reuse this for actual progress.
        // For now it just touches the content once or completes it when touched.

        // No course progress, no content refs or the given one is invalid.
        if (
            courseProgress.id === undefined ||
            courseProgress.contentProgressTrackers === undefined ||
            contentRef.id === undefined
        ) {
            console.log("ContentRef: ");
            console.log(contentRef);
            return;
        }

        const contentProgress = courseProgress.contentProgressTrackers[contentRef.id];
        if (contentProgress === undefined || contentProgress.id === undefined) {
            // Touch the content ref once.
            const postReq = RequestFactory.createPostRequestWithBody(contentRef);
            console.log("Content Ref in changeProgress:");
            console.log(contentRef);
            await endpointsProgress
                .createContentProgress(postReq, courseProgress.id)
                .then((receivedContentProgress) => {
                    console.log("Created content progress:");
                    console.log(receivedContentProgress);

                    updateLastAccessedContent(contentRef);
                    updateCourseProgress();
                });
        }
    }

    async function changeVideoWatchProgress(contentRef: IContent, newProgress: number) {
        // TODO: Adjust and/or reuse this for actual progress.
        // For now it just touches the content once or completes it when touched.

        // No course progress, no content refs or the given one is invalid.
        if (
            courseProgress.id === undefined ||
            courseProgress.contentProgressTrackers === undefined ||
            contentRef.id === undefined
        ) {
            console.log("ContentRef: ");
            console.log(contentRef);
            return;
        }

        const contentProgress = courseProgress.contentProgressTrackers[contentRef.id];
        if (contentProgress === undefined || contentProgress.id === undefined) {
            return;
        }

        const putReq = RequestFactory.createPutRequest({});
        await endpointsProgress
            .updateContentProgress(putReq, contentProgress.id, newProgress)
            .then((receivedContentProgress) => {
                console.log("Set content progress to:");
                console.log(receivedContentProgress);

                // may result in a race condition i think, but this is unlikely and not dangerous in case it happens
                updateLastAccessedContent(contentRef);
                courseProgress.contentProgressTrackers[contentRef.id] = receivedContentProgress;
            });
    }

    async function completeVideo(contentRef: IContent) {
        // Update the status to complete.
        if (
            courseProgress.id === undefined ||
            courseProgress.contentProgressTrackers === undefined ||
            contentRef.id === undefined
        ) {
            console.log("ContentRef: ");
            console.log(contentRef);
            return;
        }
        const contentProgress = courseProgress.contentProgressTrackers[contentRef.id];
        const putReq = RequestFactory.createPutRequest({});
        await endpointsProgress.setContentStateComplete(putReq, contentProgress.id).then((receivedContentProgress) => {
            console.log("Set content progress to complete:");
            console.log(receivedContentProgress);

            updateLastAccessedContent(contentRef);
            updateCourseProgress();
        });
    }

    async function updateLastAccessedContent(contentRef: IContent): void {
        if (courseProgress.id === undefined) {
            return;
        }

        const putReq = RequestFactory.createPutRequest(contentRef);
        await endpointsProgress
            .updateLastAccessedContentProgress(putReq, courseProgress.id)
            .then((receivedCourseProgress) => {
                console.log("Updated last accessed content:");
                console.log(receivedCourseProgress);
            });
    }

    function _getAllChapters() {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsChapter.getAllChapters(request).then((chaptersReceived: IChapter[]) => {
            setChapterList(
                chaptersReceived.filter((chap: IChapter) => {
                    if (chap.courseId == course.id) {
                        return chap;
                    }
                })
            );

            console.log("Chapter List of Course:");
            console.log(chapterList);

            //videoReceived.filter(((vid: IVideo) => {
            //          if (vid.id !== undefined && chapterPlaylist.includes(vid.id)) {return vid} })));
        });
    }

    function _getChapter() {
        const request: RequestInit = RequestFactory.createGetRequest();
        setVideoListLoading(true);
        endpointsChapter
            .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
            .then((chapterReceived: IChapter) => {
                setChapter(chapterReceived);
                console.log(chapterReceived);
                if (chapterReceived.contentReferences !== undefined) {
                    console.log(chapterReceived.contentReferences);
                    setChapterPlaylist(chapterReceived.contentReferences);
                }
            })
            .finally(async () => setVideoListLoading(false));
    }

    function _gotoNextChapter() {
        let chapterIndex = chapterList.findIndex((i) => i.id);
        //const chaindex = chapter.findIndex((x) => x.value == question?.type);

        console.log("ChapterIndex:");
        console.log(chapterIndex);

        if (chapterList !== undefined) {
            (chapterIndex = chapterIndex + 1), console.log("IF Chapter List Not undefined:");
            console.log(chapterIndex);
            navigation.navigate("CHAPTER_CONTENT", {
                chapterId: chapterList[chapterIndex].id,
            });
        }
    }

    function _gotoLastChapter() {
        let chapterIndex = chapterList.findIndex((i) => i.id);
        //const chaindex = chapter.findIndex((x) => x.value == question?.type);

        console.log("ChapterIndex:");
        console.log(chapterIndex);

        if (chapterList !== undefined) {
            (chapterIndex = chapterIndex - 1), console.log("IF Chapter List Not undefined:");
            console.log(chapterIndex);
            navigation.navigate("CHAPTER_CONTENT", {
                chapterId: chapterList[chapterIndex].id,
            });
        }
    }

    function _getVideoUrl(): string {
        let vidId: string = " ";
        //vidId = chapterPlaylist[1]
        vidId = currentVideo?.contentId;
        console.log("Vid Id:");
        console.log(vidId);

        if (videos == undefined || videos == undefined || null) {
            toast.error(i18n.t("itrex.videoNotFound"));
            return "";
        }
        return createVideoUrl(vidId);
    }

    function changeCurrentVideo(vid?: IContent) {
        if (vid !== undefined) {
            setCurrentVideo(vid);
            _getVideoUrl();
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
    scrollContainer: {
        width: "screenWidth",
        alignItems: "center",
        paddingBottom: 20,
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

    textStyle: {
        margin: 10,
        color: "white",
        fontWeight: "bold",
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
