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

export const ScreenAddQuiz: React.FC = () => {
    const course: ICourse = React.useContext(CourseContext);
    const [chapter, setChapter] = useState<IChapter>({});
    const [chapterPlaylist, setChapterPlaylist] = useState<IContent[]>([]);

    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState<IVideo[]>([]);
    const [isVideoListLoading, setVideoListLoading] = useState(true);

    React.useContext(LocalizationContext);
    const route = useRoute<ChapterContentRouteProp>();
    //const navigation = useNavigation<ScreenCourseTabsNavigationProp>();
    //const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
    let chapterId = route.params.chapterId;

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
            _getAllVideos();
        }, [course])
    );

    const playlistlistItem = ({ item }: { item: IVideo }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                borderRadius: 2,
                backgroundColor: dark.theme.pink,
                borderColor: dark.theme.darkBlue4,
                borderWidth: 2,
            }}>
            <TouchableOpacity onPress={() => _getVideoUrl(item)}>
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
        <View style={styles.container}>
            <Text style={styles.textStyle}>Lovely Playlist:</Text>
            <FlatList
                data={videos}
                renderItem={playlistlistItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text>Videos here</Text>}
            />
            <Video style={[styles.video, {}]} />
        </View>
    );

    function _getChapter() {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsChapter
            .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
            .then((chapterReceived: IChapter) => {
                setChapter(chapterReceived);
                if (chapterReceived.contentObjects !== undefined) {
                    setChapterPlaylist(chapterReceived.contentObjects);
                }
            });
    }

    function _getVideoUrl(vid: IVideo): string {
        if (vid == undefined || vid.id == undefined || null) {
            toast.error(i18n.t("itrex.videoNotFound"));
            return "";
        }

        return createVideoUrl(vid.id);
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
    container: {
        backgroundColor: dark.theme.darkBlue1,
        flex: 1,
    },
    video: {
        backgroundColor: dark.theme.pink,
        height: "100 px",
        width: "100px",
    },
    videoListDownloadingContainer: {},
    loadingIcon: {},
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
    listItemTitle: {},
    listItemSubtitle: {},
});
