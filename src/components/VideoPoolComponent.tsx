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
import { FilePickerService } from "../services/FilePickerService";
import { buildVideoAsFormData } from "../services/VideoFormDataService";

const endpointsVideo = new EndpointsVideo();
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
const loggerUI = loggerFactory.getLogger("UI.VideoPoolComponent");

let translateY = new Animated.Value(100);

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
    Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: false }).start();

    // Call following function/s only once when this screen is shown.
    useFocusEffect(
        React.useCallback(() => {
            loggerService.trace("EXECUTING THIS ONLY ONCE ON SCREEN FOCUS!");
            _resetAnimBeforeGetAllVideos();
        }, [course])
    );

    // Render UI for video upload.
    const renderVideoUpload = () => {
        if (isVideoUploading) {
            loggerUI.trace("Uploading videos: displaying loading icon.");
            return (
                <View style={styles.videoUploadContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.infoText}>Please wait, the video upload is in progress...</Text>
                </View>
            );
        }

        loggerUI.trace("Ready to upload videos: displaying video upload UI.");
        return (
            <View style={styles.videoUploadContainer}>
                <Text style={styles.infoText}>{i18n.t("itrex.videoProperties")}</Text>

                <TouchableOpacity style={styles.button} onPress={_initVideoUpload}>
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
                        renderItem={renderVideoListItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Animated.View>
            </View>
        );
    };

    // Button to refresh video list.
    const renderRefreshButton = () => (
        <TouchableOpacity style={styles.refreshButton} onPress={() => _resetAnimBeforeGetAllVideos()}>
            <MaterialCommunityIcons name="refresh" size={32} color="white" />
        </TouchableOpacity>
    );

    // Creation of each item of video list.
    const renderVideoListItem = ({ item }: { item: IVideo }) => (
        <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
                _resetAllStates();
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

                <TouchableOpacity style={styles.deleteButton} onPress={() => _deleteVideo(item.id)}>
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

    async function _initVideoUpload() {
        loggerService.trace("Initialising video picker.");
        const filePicker: FilePickerService = new FilePickerService();
        const pickedVideos: File[] = await filePicker.pickFile();

        loggerService.trace("Initialising video upload.");
        await _uploadVideos(pickedVideos);
        _resetAnimBeforeGetAllVideos();
    }

    async function _uploadVideos(selectedVideos: File[]): Promise<void> {
        setVideoUploading(true);

        for (const selectedVideo of selectedVideos) {
            await _uploadVideo(selectedVideo);
        }

        setVideoUploading(false);
    }

    // eslint-disable-next-line complexity
    async function _uploadVideo(selectedVideo: File): Promise<void> {
        if (selectedVideo == undefined || course.id == undefined) {
            return;
        }
        loggerService.trace("Selected video: " + selectedVideo.name);

        const videoFormData: FormData = await buildVideoAsFormData(selectedVideo, course.id);
        const postRequest: RequestInit = RequestFactory.createPostRequestWithFormData(videoFormData);
        const response: IVideo = await endpointsVideo.uploadVideo(postRequest);

        if (response.id == undefined || response.title == undefined) {
            console.warn("Upload failed of video: " + selectedVideo.name);
            return;
        }

        console.warn("Upload finished of video: " + selectedVideo.name);
        console.log(response);
    }

    function _resetAnimBeforeGetAllVideos() {
        translateY = new Animated.Value(100);
        _getAllVideos();
    }

    async function _getAllVideos(): Promise<void> {
        if (course.id == undefined) {
            return;
        }
        loggerService.trace("Getting all videos of course: " + course.id);

        setVideoListLoading(true);
        setVideos(initialVideoState);

        const request: RequestInit = RequestFactory.createGetRequest();
        const response: Promise<IVideo[]> = endpointsVideo.getAllVideos(request, course.id);

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

    async function _deleteVideo(videoId?: string): Promise<void> {
        if (videoId === undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
        const response: Promise<Response> = endpointsVideo.deleteVideo(deleteRequest, videoId);
        response.then(() => {
            _getAllVideos();
        });
    }

    function _resetAllStates(): void {
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
        maxWidth: "90%",
        textAlign: "center",
        margin: 10,
        fontSize: 20,
        color: "white",
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
