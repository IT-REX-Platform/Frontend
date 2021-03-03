import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    ImageBackground,
    Platform,
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
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import {
    ImagePickerResult,
    launchImageLibraryAsync,
    MediaLibraryPermissionResponse,
    MediaTypeOptions,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { createAlert } from "../helperScripts/createAlert";
import { VideoFormDataParams } from "../constants/VideoFormDataParams";

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

    // Call following function/s only once when this screen is shown.
    useFocusEffect(
        React.useCallback(() => {
            loggerService.trace("EXECUTING THIS ONLY ONCE ON SCREEN FOCUS!");
            if (Platform.OS === "ios") {
                loggerService.trace("Asking for iOS camera permission.");
                const response: Promise<MediaLibraryPermissionResponse> = requestMediaLibraryPermissionsAsync();
                response.then(() => {
                    if (status !== "granted") {
                        loggerService.trace("iOS camera permission denied.");
                        alert(i18n.t("itrex.imagePickerPermAlert"));
                    }
                    loggerService.trace("iOS camera permission granted.");
                });
            }

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

                <FlatList
                    style={styles.videoList}
                    showsVerticalScrollIndicator={false}
                    data={videos}
                    renderItem={renderListItem}
                    keyExtractor={(item, index) => index.toString()}
                />
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
                    <ListItem.Subtitle style={styles.listItemSubtitle}>
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
        // resetAllStates();
        // navigation.navigate(NavigationRoutes.ROUTE_VIDEO_UPLOAD);

        const pickedVideo: { uri: string; name: string } = await chooseFilePicker();
        await initVideoUpload(pickedVideo);
        getAllVideos(course.id);
    }

    async function chooseFilePicker() {
        if (Platform.OS !== "ios") {
            return await pickDocument();
        } else {
            return await pickImage();
        }
    }

    // Expo document picker that only allows picking of video files in mp4 format.
    async function pickDocument(): Promise<{ uri: string; name: string }> {
        const document: DocumentResult = await getDocumentAsync({
            type: "video/mp4",
        });

        if (document.type === "cancel") {
            return { uri: "", name: "" };
        }

        return { uri: document.uri, name: document.name };
    }

    // Expo image picker that only allows picking of video files.
    async function pickImage(): Promise<{ uri: string; name: string }> {
        const video: ImagePickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Videos,
            allowsEditing: true,
        });

        if (video.cancelled === true) {
            return { uri: "", name: "" };
        }

        return { uri: video.uri, name: "Unnamed video file" };
    }

    async function initVideoUpload(pickedVideo: { uri: string; name: string }): Promise<void> {
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

    // Build a FormData object from the video uri.
    async function buildVideoAsFormData(videoUri: string, videoName: string, courseId: string): Promise<FormData> {
        const response: Response = await fetch(videoUri);
        const fileBlob: Blob = await response.blob();
        const formData: FormData = new FormData();
        formData.append(VideoFormDataParams.PARAM_VIDEO_FILE, fileBlob, videoName);
        formData.append(VideoFormDataParams.PARAM_COURSE_ID, courseId);
        return formData;
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
        alignItems: "center",
    },
    header: {
        textAlign: "center",
        color: dark.theme.pink,
        fontSize: 50,
    },
    videoUploadingContainer: {
        width: "95%",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    videoUploadContainer: {
        width: "95%",
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
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        backgroundColor: dark.theme.darkBlue4,
        borderRadius: 2,
    },
    buttonText: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        color: "white",
        fontSize: 20,
    },
    videoListDownloadingContainer: {
        flex: 1,
        alignItems: "center",
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
        textAlign: "center",
        justifyContent: "center",
        marginTop: 50,
        padding: 50,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    videoList: {
        maxWidth: "95%",
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
