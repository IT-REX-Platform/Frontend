//How do I know, which Chapter to Show? Is this managed by Context?
//1. Import Endpoint for Chapter?
//2. Übersicht über alle Videos als Playlist: Flatlist mit Videoname und Link zur Resource
//TODO: on click on video, load it to media player
//3. Videoplayer der ausgewähltes  Video spielt

import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
import { createVideoUrl } from "../../services/createVideoUrl";
//import { ScreenCourseTabsNavigationProp, ScreenCourseTabsRouteProp } from "../../course/ScreenCourseTabs";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { ImageBackground } from "react-native";
import { IContent } from "../../types/IContent";
import { EndpointsChapter } from "../../api/endpoints/EndpointsChapter";

const endpointsVideo = new EndpointsVideo();
const endpointsChapter = new EndpointsChapter();

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    const course: ICourse = React.useContext(CourseContext);
    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterPlaylist, setChapterPlaylist] = useState<string[]>([]);

    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [isVideoListLoading, setVideoListLoading] = useState(true);

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
            _getChapter();
        }, [course])
    );

    const playlistlistItem = ({ item }: { item: string }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderColor: dark.theme.darkBlue3,
                borderWidth: 2,
            }}>
            <TouchableOpacity onPress={() => _getVideoUrl(item)}>
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>Subtitle</ListItem.Subtitle>
                </ListItem.Content>
            </TouchableOpacity>
        </ListItem>
    );

    return (
        <View style={styles.rootContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.videoContainer}>
                    <Text style={styles.videoTitle}>Ch1.: My Video</Text>
                    <Video style={[styles.video, {}]} />
                </View>
                <View style={styles.playlistContainer}>
                    <Text style={styles.videoTitle}>Playlist</Text>
                    <FlatList
                        style={styles.flatList}
                        data={chapterPlaylist}
                        renderItem={playlistlistItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<Text>Videos here</Text>}
                    />
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
                    setChapterPlaylist(chapterReceived.contents);
                    console.log(chapterPlaylist);
                }
            });
    }

    function _getVideoUrl(vid: string): string {
        if (vid == undefined || vid == undefined || null) {
            toast.error(i18n.t("itrex.videoNotFound"));
            return "";
        }
        return createVideoUrl(vid);
    }

    async function _getAllVideos(): Promise<void> {
        if (course.id == undefined) {
            return;
        }

        setVideoListLoading(true);
        setVideos(initialVideoState);

        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsVideo
            .getAllVideos(request, course.id, undefined, i18n.t("itrex.getVideosError"))
            .then((videosReceived: IVideo[]) => {
                setVideos(
                    videosReceived.filter((video) => {
                        video.chapterId == chapterId;
                        console.log(video.chapterId);
                    })
                );
                console.log(chapterId);
                console.log(videos);
                console.log(videosReceived);
            })
            .finally(async () => setVideoListLoading(false));
    }
};

const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: dark.theme.darkBlue1,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: "3%",
    },

    contentContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
    },

    video: {
        borderColor: dark.theme.darkBlue2,
        borderWidth: 3,
        width: "75%",
        alignSelf: "flex-start",
        marginTop: "0.5%",
    },
    videoListDownloadingContainer: {},
    loadingIcon: {},
    imageContainer: {
        flex: 1,
        paddingTop: "3%",
        backgroundColor: dark.theme.darkBlue1,
    },
    flatList: {
        alignSelf: "flex-end",
        position: "absolute",
        width: "22%",
    },
    scrollContainer: {
        width: "screenWidth",
        alignItems: "center",
        paddingBottom: 20,
    },

    videoTitle: {
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
    listItemTitle: {},
    listItemSubtitle: {},
});
