import { DarkTheme, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View, StyleSheet, Text, Animated } from "react-native";
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

const endpointsVideo = new EndpointsVideo();
const endpointsChapter = new EndpointsChapter();
const endpointsCourse = new EndpointsCourse();

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    const course: ICourse = React.useContext(CourseContext);
    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterPlaylist, setChapterPlaylist] = useState<string[]>([]);

    const initialVideoState: IVideo[] = [];
    const [isVideoListLoading, setVideoListLoading] = useState(true);
    const videoList: IVideo[] = [];
    //Store URL of Current Video here:
    let [currentVideo, setCurrentVideo] = useState<string>(chapterPlaylist[0]);
    //let currentVideo: string;
    //const [chapterPlaylist2, setChapterPlaylist2] = useState<string[]>([]);
    const [videos, setVideos] = useState<IVideo[]>([]);
    //let video: IVideo

    let [likeCounter, setLikeCounter] = useState(0);
    let [dislikeCounter, setDislikeCounter] = useState(0);

    //Vertical slide animation for FlatList.
    let translateY = new Animated.Value(100);
    Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: false }).start();

    React.useContext(LocalizationContext);
    const route = useRoute<ChapterContentRouteProp>();
    //const navigation = useNavigation<ScreenCourseTabsNavigationProp>();
    //const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
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
            _getChapter();
            _getAllVideos();
            setCurrentVideo(chapterPlaylist[0]);
        }, [course])
    );

    const playlistlistItem = ({ item }: { item: IVideo }) => (
        <ListItem
            containerStyle={{
                marginBottom: "2.5%",
                backgroundColor: dark.theme.darkBlue2,
            }}>
            <TouchableOpacity onPress={() => changeCurrentVideo(item.id)}>
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item.title}
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
                    <View style={styles.iconContainer}>
                        <TouchableOpacity style={[styles.iconBox, { paddingRight: 0 }]}>
                            <MaterialIcons name="file-download" size={28} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <MaterialIcons
                                name="favorite-border"
                                size={28}
                                color="rgba(255,255,255,0.8)"
                                style={styles.icon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setDislikeCounter(dislikeCounter++)} style={styles.iconBox}>
                            <Foundation name="dislike" size={28} color="rgba(255,255,255,0.8)" style={styles.icon} />
                            <Text style={styles.textIcon}>{dislikeCounter}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setLikeCounter(likeCounter++)} style={styles.iconBox}>
                            <Foundation
                                name="like"
                                size={28}
                                color="rgba(255,255,255,0.8)"
                                style={[styles.icon, { transform: [{ rotateY: "180deg" }] }]}
                            />
                            <Text style={styles.textIcon}>{likeCounter}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.playlistContainer}>
                    <Text style={styles.videoTitle}>Playlist</Text>
                    <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                        <FlatList
                            style={styles.playlist}
                            data={videos}
                            showsVerticalScrollIndicator={true}
                            renderItem={playlistlistItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={<Text>Videos here</Text>}
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );

    function _getChapter() {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsChapter
            .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
            .then((chapterReceived: IChapter) => {
                setChapter(chapterReceived);
                console.log(chapterReceived);
                if (chapterReceived.contents !== undefined) {
                    console.log(chapterReceived.contents);
                    setChapterPlaylist(chapterReceived.contents);
                }
            });
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

    function changeCurrentVideo(vidId: string) {
        setCurrentVideo(vidId);
        _getVideoUrl();
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
            .findAllVideosOfACourse(request, course.id, undefined, i18n.t("itrex.getVideosError"))
            .then((videoReceived: IVideo[]) => {
                //videoList.push(videoReceived.filter(((vid: IVideo) => {
                //          if (vid.id !== undefined && chapterPlaylist.includes(vid.id)) {return vid} })));

                setVideos(
                    videoReceived.filter((video: IVideo) => {
                        if (video.id !== undefined && chapterPlaylist.includes(video.id)) {
                            return video;
                        }
                    })
                );

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
});
