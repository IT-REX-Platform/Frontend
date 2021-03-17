import { DarkTheme, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
    Animated,
    StyleProp,
    ViewStyle,
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
import { ImageBackground } from "react-native";
import { IContent } from "../../types/IContent";
import { EndpointsChapter } from "../../api/endpoints/EndpointsChapter";
import { Icon } from "react-native-vector-icons/Icon";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import useStateWithCallback from "use-state-with-callback";
import { EndpointsProgress } from "../../api/endpoints/EndpointsProgress";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { ContentProgressTrackerState } from "../../constants/ContentProgressTrackerState";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { render } from "react-dom";
import { borderRadius } from "react-select/src/theme";
import { waitFor } from "@testing-library/react-native";

const endpointsVideo = new EndpointsVideo();
const endpointsChapter = new EndpointsChapter();
const endpointsProgress = new EndpointsProgress();
const endpointsCourse = new EndpointsCourse();

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    const course: ICourse = React.useContext(CourseContext);
    console.log("KursID:");
    console.log(course.id);
    const [courseProgress, setCourseProgress] = useState<ICourseProgressTracker>({});
    useEffect(() => {
        const request: RequestInit = RequestFactory.createGetRequest();
    }, []);

    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterPlaylist, setChapterPlaylist] = useState<IContent[]>([]);

    const initialVideoState: IVideo[] = [];
    const [isVideoListLoading, setVideoListLoading] = useState(true);
    const videoList: IVideo[] = [];
    //Store URL of Current Video here:
    let [currentVideo, setCurrentVideo] = useState<string>();
    //let currentVideo: string;
    const [videos, setVideos] = useState<IContent[]>([]);
    //let video: IVideo

    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [isDisplayChanging, setDisplayChanging] = useState<boolean>(false);

    //Vertical slide animation for FlatList.
    let translateY = new Animated.Value(50);
    Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: false }).start();

    React.useContext(LocalizationContext);
    const route = useRoute<ChapterContentRouteProp>();
    const chapterId = route.params.chapterId;

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

            const progressRequest: RequestInit = RequestFactory.createGetRequest();
            endpointsProgress
                .getCourseProgress(progressRequest, course.id, undefined, i18n.t("itrex.getCourseProgressError"))
                .then((receivedProgress) => {
                    console.log("Progress of course Init:");
                    console.log(receivedProgress);
                    setCourseProgress(receivedProgress);
                });
            _getChapter();
            //_getAllVideos();
            setVideos(chapterPlaylist);
            if (chapterPlaylist.length > 0) {
                setCurrentVideo(chapterPlaylist[0].contentId);
            }
        }, [course])
    );

    const myPlaylistItem = ({ item }: { item: IContent }) => {
        let bck: string = " ";

        console.log("RenderItemID");
        console.log(item.id);

        //TODO: Warte mit Ausführung, bis Progress im Backend geupdated ist!

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

            if (contentProgress == undefined) {
                console.log("If contentProgress undefined:");
                console.log(contentProgress == undefined);

                bck = dark.Opacity.pink;
            } else if (contentProgress.state == ContentProgressTrackerState.STARTED) {
                console.log("Else If contentProgress Started:");
                console.log(contentProgress.state == ContentProgressTrackerState.STARTED);

                bck = dark.Opacity.blueGreen;
            } else if (contentProgress.state == ContentProgressTrackerState.COMPLETED) {
                console.log("Else If contentProgress Completed:");
                console.log(contentProgress.state == ContentProgressTrackerState.COMPLETED);

                bck = dark.Opacity.lightGreen;
            }
            setDisplayChanging(false);
        }
        //console.log(courseProgress);
        //const bck : string = item.id === selectedId ? dark.theme.darkBlue4 : dark.theme.darkGreen;
        const mystyle = {
            marginBottom: "2.5%",
            backgroundColor: bck,
        };

        return (
            <ListItem containerStyle={mystyle}>
                {/* <TouchableOpacity onPress={() => {changeCurrentVideo(item.id); changeVideoProgress(item); renderListDummy(item)} }> */}

                <TouchableOpacity
                    onPress={() => {
                        changeCurrentVideo(item.contentId);
                        changeVideoProgress(item);
                        setSelectedId(item.id?.slice());
                    }}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                            {item?.id}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.listItemSubtitle}>Subtitle</ListItem.Subtitle>
                    </ListItem.Content>
                </TouchableOpacity>
            </ListItem>
        );
    };

    const playlistlistItem = ({ item }: { item: IContent }) => (
        <ListItem
            containerStyle={{
                marginBottom: "2.5%",
                //backgroundColor: dark.theme.darkBlue2,
                //backgroundColor: {item.id === selectedId ? "#6e3b6e" : "#f9c2ff"},
            }}>
            {/* <TouchableOpacity onPress={() => {changeCurrentVideo(item.id); changeVideoProgress(item); renderListDummy(item)} }> */}

            <TouchableOpacity
                onPress={() => {
                    changeCurrentVideo(item.contentId);
                    changeVideoProgress(item);
                    setSelectedId(item.id?.slice());
                }}>
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item?.id}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>Subtitle</ListItem.Subtitle>
                </ListItem.Content>
            </TouchableOpacity>
        </ListItem>
    );

    return (
        <View style={styles.rootContainer}>
            <Text style={styles.chapterHeading}>Ch 1. Some Chaptername</Text>
            <View style={styles.contentContainer}>
                <View style={styles.videoContainer}>
                    <Text style={styles.videoTitle}>Ch1.: My Video</Text>
                    <Video
                        style={styles.video}
                        source={{ uri: _getVideoUrl() }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay={false}
                        useNativeControls={true}
                    />
                </View>
                <View style={styles.playlistContainer}>
                    <Text style={styles.videoTitle}>Playlist</Text>
                    {renderVideoList()}
                    <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                        <FlatList
                            style={styles.playlist}
                            data={videos}
                            showsVerticalScrollIndicator={true}
                            renderItem={myPlaylistItem}
                            //renderItem={thisPlaylistItem}
                            extraData={isDisplayChanging}
                            keyExtractor={(item) => item.id ?? ""}
                            ListEmptyComponent={<Text>Videos here</Text>}
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );

    function changeVideoProgress(contentRef: IContent) {
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
            endpointsProgress
                .createContentProgress(postReq, courseProgress.id)
                .then((receivedContentProgress) => {
                    console.log("Created content progress:");
                    console.log(receivedContentProgress);

                    updateLastAccessedContent(contentRef);
                })
                .finally(() => {
                    setDisplayChanging(true);
                });
        } else {
            // Update the status to complete.
            const putReq = RequestFactory.createPutRequest({});
            endpointsProgress
                .setContentStateComplete(putReq, contentProgress.id)
                .then((receivedContentProgress) => {
                    console.log("Set content progress to complete:");
                    console.log(receivedContentProgress);

                    updateLastAccessedContent(contentRef);
                })
                .finally(() => {
                    setDisplayChanging(true);
                });
        }
    }

    function updateLastAccessedContent(contentRef: IContent): void {
        if (courseProgress.id === undefined) {
            return;
        }

        const putReq = RequestFactory.createPutRequest(contentRef);
        endpointsProgress
            .updateLastAccessedContentProgress(putReq, courseProgress.id)
            .then((receivedCourseProgress) => {
                console.log("Updated last accessed content:");
                console.log(receivedCourseProgress);
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

    function _getVideoUrl(): string {
        let vidId: string = " ";
        //vidId = chapterPlaylist[1]
        vidId = currentVideo;
        console.log("Vid Id:");
        console.log(vidId);

        if (videos == undefined || videos == undefined || null) {
            toast.error(i18n.t("itrex.videoNotFound"));
            return "";
        }
        return createVideoUrl(vidId);
    }

    function changeCurrentVideo(vidId?: string) {
        if (vidId !== undefined) {
            setCurrentVideo(vidId);
            _getVideoUrl();
        }
    }

    // function setVideos(): IVideo[]{}

    async function _getAllVideos(): Promise<void> {
        if (course.id == undefined) {
            return;
        }

        setVideoListLoading(true);
        //setVideos(initialVideoState);

        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsVideo
            .getAllVideos(request, course.id, undefined, i18n.t("itrex.getVideosError"))
            .then((videoReceived: IVideo[]) => {
                //videoList.push(videoReceived.filter(((vid: IVideo) => {
                //          if (vid.id !== undefined && chapterPlaylist.includes(vid.id)) {return vid} })));
                let vidList: IContent[] = [];
                for (const vid in videoReceived) {
                    for (const cont in chapterPlaylist) {
                        if (videoReceived[vid].id == chapterPlaylist[cont].id) {
                            vidList.push(chapterPlaylist[cont]);
                        }
                    }
                }
                setVideos(vidList);

                console.log("VidList:");
                console.log(vidList);

                //setVideos(

                //    videoReceived.filter((video: IVideo) => {
                //        if (video.id !== undefined && vidList.includes(video.id)) {
                //            return video;
                //        }
                //    })
                //);

                console.log("Result of Filter:");
                console.log(videos);

                //setChapterPlaylist2(["asdf", "asdf2"]);

                //console.log("gsicht" + chapterPlaylist2 + " asdf");

                console.log("Content ID in get all videos: ");
                console.log(chapterPlaylist);
                //console.log("Videos Received in get all videos: " );
                //console.log(videoReceived)
            })

            .finally(async () => setVideoListLoading(false));
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
        fontWeight: "bold",
        paddingRight: "20px",
    },
    video: {
        //borderColor: dark.theme.darkBlue2,
        //borderWidth: 3,
        marginTop: 20,
    },

    videoListDownloadingContainer: {},
    loadingIcon: {},

    iconContainer: {
        flex: 1,
        flexDirection: "row-reverse",
        borderColor: dark.theme.grey,
        borderBottomWidth: 1.5,
        padding: "0.5%",
    },

    iconBox: {
        flexDirection: "row",
        paddingLeft: "1%",
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
