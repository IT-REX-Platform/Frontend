import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from "../locales";
import { loggerFactory } from "../../logger/LoggerConfig";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IVideo } from "../types/IVideo";
import { useFocusEffect } from "@react-navigation/native";
import { ICourse } from "../types/ICourse";
import { CourseContext, LocalizationContext } from "./Context";
import { dark } from "../constants/themes/dark";
import { ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calculateVideoSize } from "../services/calculateVideoSize";
import { createAlert } from "../helperScripts/createAlert";
import { FilePickerService } from "../services/FilePickerService";
import { IPickedFile } from "../types/IPickedFile";
import { buildVideoAsFormData } from "../services/VideoFormDataService";

const endpointsVideo = new EndpointsVideo();
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
const loggerUI = loggerFactory.getLogger("UI.VideoPoolComponent");

export const VideoPoolComponent: React.FC = () => {
    // Navigation hook.
    const navigation = useNavigation();

    // Get localization from context.
    React.useContext(LocalizationContext);

    // Get course infos from context.
    const course: ICourse = React.useContext(CourseContext);

    // States.
    const [isVideoUploading, setVideoUploading] = useState(false);
    const [isVideoListLoading, setVideoListLoading] = useState(true);
    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState(initialVideoState);

    // Vertical slide animation for FlatList.
    const translateY = new Animated.Value(100);
    Animated.timing(translateY, { toValue: 1, duration: 500, useNativeDriver: false }).start();

    // Call following function/s only once when this screen is shown.
    useFocusEffect(
        React.useCallback(() => {
            loggerService.trace("EXECUTING THIS ONLY ONCE ON SCREEN FOCUS!");
            loggerService.trace("Getting all videos of course: " + course.id);
            getAllVideos(course.id);
        }, [course])
    );

    // Render UI for video upload.
    const renderVideoUpload = () => {
        if (isVideoUploading) {
            loggerUI.trace("Uploading videos: displaying loading icon.");
            return (
                <View style={styles.videoUploadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        loggerUI.trace("Ready to upload videos: displaying video upload UI.");
        return (
            <View style={styles.videoUploadContainer}>
                <Text style={styles.infoText}>Choose an MP4 video file of size up to 100MB.</Text>
                <TouchableOpacity style={styles.button} onPress={uploadVideo}>
                    <Text style={styles.buttonText}>{i18n.t("itrex.toUploadVideo")}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render UI for video list according to un-/available video data.
    const renderVideoList = () => {
        if (isVideoListLoading) {
            loggerUI.trace("Receiving videos: displaying loading icon.");
            return (
                <View style={styles.videoListDownloadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        if (videos.length < 1) {
            loggerUI.trace("No video data received: displaying info box.");
            return (
                <View style={styles.videoListContainer}>
                    {renderRefreshButton()}

                    <View style={styles.infoTextBox}>
                        <Text style={styles.infoText}>{i18n.t("itrex.noVideosAvailable")}</Text>
                    </View>
                </View>
            );
        }

        loggerUI.trace("Video data received: displaying video list.");
        return (
            <View style={styles.videoListContainer}>
                {renderRefreshButton()}

                <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                    <FlatList
                        style={styles.videoList}
                        showsVerticalScrollIndicator={false}
                        data={videos}
                        renderItem={renderListItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Animated.View>
            </View>
        );
    };

    // Button to refresh video list.
    const renderRefreshButton = () => (
        <TouchableOpacity style={styles.refreshButton} onPress={() => getAllVideos(course.id)}>
            <MaterialCommunityIcons name="refresh" size={32} color="white" />
        </TouchableOpacity>
    );

    // Creation of each item of video list.
    const renderListItem = ({ item }: { item: IVideo }) => (
        <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
                resetAllStates();
                navigation.navigate("VIDEO", { video: item });
            }}>
            <ListItem
                containerStyle={{
                    marginBottom: 5,
                    backgroundColor: dark.theme.darkBlue2,
                    borderColor: dark.theme.darkBlue4,
                    borderWidth: 2,
                    borderRadius: 2,
                }}>
                <MaterialCommunityIcons name="video-vintage" size={28} color="white" />

                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item.title}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle} numberOfLines={1} lineBreakMode="tail">
                        {calculateVideoSize(item.length)}
                    </ListItem.Subtitle>
                </ListItem.Content>

                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVideo(item.id)}>
                    <MaterialCommunityIcons style={styles.deleteIcon} name="delete" size={32} color="red" />
                </TouchableOpacity>

                <ListItem.Chevron color="white" />
            </ListItem>
        </TouchableOpacity>
    );

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.imageContainer}>
            <Text style={styles.header}>{i18n.t("itrex.videoPool")}</Text>
            {renderVideoUpload()}
            {renderVideoList()}
        </ImageBackground>
    );

    async function uploadVideo() {
        const filePicker: FilePickerService = new FilePickerService();
        const pickedVideo: IPickedFile = await filePicker.pickFile();

        await initVideoUpload(pickedVideo);

        getAllVideos(course.id);
    }

    async function initVideoUpload(pickedVideo: IPickedFile): Promise<void> {
        if (pickedVideo.uri === "" || course.id === undefined) {
            return;
        }
        setVideoUploading(true);

        const video: FormData = await buildVideoAsFormData(pickedVideo.uri, pickedVideo.name, course.id);
        const postRequest: RequestInit = RequestFactory.createPostRequestWithFormData(video);
        const response: IVideo = await endpointsVideo.uploadVideo(postRequest);
        console.log(response);

        setVideoUploading(false);
        createAlert(i18n.t("itrex.uploadVideoSuccessMsg"));
    }

    async function getAllVideos(courseId?: string): Promise<void> {
        setVideoListLoading(true);
        setVideos(initialVideoState);

        const request: RequestInit = RequestFactory.createGetRequest();
        const response: Promise<IVideo[]> = endpointsVideo.getAllVideos(request, courseId);

        await response
            .then((videosReceived: IVideo[]) => {
                setVideos(videosReceived);
                loggerService.trace("Received videos in next line:");
                console.log(videosReceived);
            })
            .catch((error) => {
                loggerService.error("An error has occured while getting videos.", error);
            })
            .finally(() => {
                setVideoListLoading(false);
            });
    }

    async function deleteVideo(videoId?: string): Promise<void> {
        if (videoId === undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
        const response: Promise<Response> = endpointsVideo.deleteVideo(deleteRequest, videoId);
        response.then(() => {
            getAllVideos(course.id);
        });
    }

    function resetAllStates(): void {
        setVideoUploading(false);
        setVideoListLoading(true);
        setVideos(initialVideoState);
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center", // Prevents video list item names from being unnecessary cut.
    },
    header: {
        textAlign: "center",
        color: dark.theme.pink,
        fontSize: 50,
    },
    videoUploadingContainer: {
        width: "95%",
        alignSelf: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    videoUploadContainer: {
        width: "95%",
        alignSelf: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    infoText: {
        color: "white",
        fontSize: 20,
        margin: 10,
    },
    button: {
        margin: 5,
        backgroundColor: dark.theme.darkBlue4,
        borderRadius: 2,
    },
    buttonText: {
        padding: 10,
        fontSize: 20,
        color: "white",
    },
    videoListDownloadingContainer: {
        flex: 1,
        justifyContent: "center",
    },
    videoListContainer: {
        flex: 1,
        maxWidth: "100%",
        alignItems: "center",
    },
    refreshButton: {
        padding: 20,
    },
    infoTextBox: {
        maxWidth: "95%",
        marginTop: 50,
        padding: 50,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    videoList: {
        marginBottom: 20,
    },
    listItemTitle: {
        color: "white",
        fontWeight: "bold",
    },
    listItemSubtitle: {
        color: "white",
    },
    deleteButton: {
        borderColor: "red",
        borderWidth: 1,
    },
    deleteIcon: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingStart: 20,
        paddingEnd: 20,
    },
});
