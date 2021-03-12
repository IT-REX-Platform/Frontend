//How do I know, which Chapter to Show? Is this managed by Context?
//1. Import Endpoint for Chapter?
//2. Übersicht über alle Videos als Playlist: Flatlist mit Videoname und Link zur Resource
//TODO: on click on video, load it to media player
//3. Videoplayer der ausgewähltes  Video spielt

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
import { ScreenCourseTabsNavigationProp, ScreenCourseTabsRouteProp } from "./course/ScreenCourseTabs";
import { RequestFactory } from "../../api/requests/RequestFactory";

const endpointsVideo = new EndpointsVideo();

export type ChapterContentRouteProp = RouteProp<RootDrawerParamList, "ROUTE_CHAPTER_CONTENT">;

export const ScreenChapterStudent: React.FC = () => {
    const course: ICourse = React.useContext(CourseContext);

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
                <View style={videoPoolStyles.videoListDownloadingContainer}>
                    <ActivityIndicator style={videoPoolStyles.loadingIcon} size="large" color="white" />
                </View>
            );
        }
    };

    const playlistlistItem = ({ item }: { item: IVideo }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                borderRadius: 2,
                backgroundColor: dark.theme.darkBlue2,
                borderColor: dark.theme.darkBlue4,
                borderWidth: 2,
            }}>
            <TouchableOpacity onPress={() => _getVideoUrl(item)}>
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item.title}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>
                        {calculateVideoSize(item.length)}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </TouchableOpacity>
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList data={videos} renderItem={playlistlistItem} keyExtractor={(item, index) => index.toString()} />
            <Video
                source={{ uri: _getVideoUrl(videos[0]) }}
                style={[
                    styles.video,
                    {
                        opacity: this.state.showVideo ? 1.0 : 0.0,
                        width: this.state.videoWidth,
                        height: this.state.videoHeight,
                    },
                ]}
            />
        </View>
    );

    function _getVideoUrl(vid: IVideo): string {
        if (vid.id == undefined || null) {
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
                setVideos(videosReceived.filter((video) => video.chapterId == chapterId));
                console.log(videosReceived);
            })

            .finally(async () => setVideoListLoading(false));
    }
};
