//How do I know, which Chapter to Show? Is this managed by Context?
//1. Import Endpoint for Chapter?
//2. Übersicht über alle Videos als Playlist: Flatlist mit Videoname und Link zur Resource
//3. Videoplayer der ausgewähltes  Video spielt

import { Video } from "expo-av";
import { FlatList, TouchableOpacity, View } from "react-native";
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react-native/node_modules/@types/react";
import { EndpointsVideo } from "../../api/endpoints/EndpointsVideo";
import { dark } from "../../constants/themes/dark";
import { IChapter } from "../../types/IChapter";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { CourseContext } from "../Context";

const endpointsVideo = new EndpointsVideo();
const course: ICourse = React.useContext(CourseContext);
const video: IVideo;
const chapter: IChapter;

export const ScreenChapterStudent: React.FC = () => {
    const playlistlistItem = ({ item }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                borderRadius: 2,
                backgroundColor: dark.theme.darkBlue2,
                borderColor: dark.theme.darkBlue4,
                borderWidth: 2,
            }}>
            <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                    {item.title}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.listItemSubtitle}>{calculateVideoSize(item.length)}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );

    return (
        <View style={styles.container}>
            <FlatList data={() => addVideo()} renderItem={playlistlistItem} keyExtractor={(item) => item.id} />
            <Video
                ref={this._mountVideo}
                style={[
                    styles.video,
                    {
                        opacity: this.state.showVideo ? 1.0 : 0.0,
                        width: this.state.videoWidth,
                        height: this.state.videoHeight,
                    },
                ]}
                resizeMode={Video.RESIZE_MODE_CONTAIN}
                onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
                onLoadStart={this._onLoadStart}
                onLoad={this._onLoad}
                onError={this._onError}
                onFullscreenUpdate={this._onFullscreenUpdate}
                onReadyForDisplay={this._onReadyForDisplay}
                useNativeControls={this.state.useNativeControls}
            />
        </View>
    );
};

function addVideo(): IVideo {
    const playList: IVideo[] = [];
    endpointsVideo.findAllVideosOfACourse(course.id).then((videos) => {
        if (video.chapterId == chapter.id) {
            playList.push(video);
        }
    });

    return playList;
}
