import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    ImageBackground,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../locales";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { EndpointsVideo } from "../../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { IVideo } from "../../types/IVideo";
import { useFocusEffect } from "@react-navigation/native";
import { CourseContext, LocalizationContext } from "../Context";
import { dark } from "../../constants/themes/dark";
import { ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calculateVideoSize } from "../../services/calculateVideoSize";
import { FilePickerService } from "../../services/FilePickerService";
import { buildVideoAsFormData } from "../../services/VideoFormDataService";
import { contentPoolStyles } from "./contentPoolStyles";
import { sleep } from "../../services/SleepService";
import { ToastService } from "../../services/toasts/ToastService";
import { TextButton } from "../uiElements/TextButton";

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
    const { course } = React.useContext(CourseContext);

    // States.
    const [isVideoUploading, setVideoUploading] = useState(false);
    const [isVideoListLoading, setVideoListLoading] = useState(true);
    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState(initialVideoState);

    const toast: ToastService = new ToastService();

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
                <View style={contentPoolStyles.addContentContainer}>
                    <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.videoUploading")}</Text>
                    <ActivityIndicator style={contentPoolStyles.loadingIcon} size="large" color="white" />
                </View>
            );
        }

        loggerUI.trace("Ready to upload videos: displaying video upload UI.");
        return (
            <View style={contentPoolStyles.addContentContainer}>
                <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.videoProperties")}</Text>
                <TextButton title={i18n.t("itrex.toUploadVideo")} onPress={_initVideoUpload} />
            </View>
        );
    };

    // Render UI for video list according to un-/available video data.
    const renderVideoList = () => {
        if (isVideoListLoading) {
            loggerUI.trace("Receiving videos: displaying loading icon.");
            return (
                <View style={contentPoolStyles.videoListDownloadingContainer}>
                    <ActivityIndicator style={contentPoolStyles.loadingIcon} size="large" color="white" />
                </View>
            );
        }

        loggerUI.trace("Video data received: displaying video list.");
        return (
            <View style={contentPoolStyles.contentListContainer}>
                {/* // flex: 1: makes the list scrollable
                // maxWidth: "95%": prevents list items from going beyond left-right screen borders */}
                <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                    <FlatList
                        style={contentPoolStyles.contentList}
                        showsVerticalScrollIndicator={false}
                        data={videos}
                        renderItem={renderVideoListItem}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={_videoListLinesToRender()}
                        ListEmptyComponent={renderEmptyList}
                    />
                </Animated.View>
            </View>
        );
    };

    // Button to refresh video list.
    const renderRefreshButton = () => (
        <TouchableOpacity style={contentPoolStyles.refreshButton} onPress={() => _resetAnimBeforeGetAllVideos()}>
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
                    borderRadius: 5,
                }}>
                <MaterialCommunityIcons name="video-vintage" size={28} color="white" />

                <ListItem.Content>
                    <ListItem.Title style={contentPoolStyles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item.title}
                    </ListItem.Title>
                    <ListItem.Subtitle
                        style={contentPoolStyles.listItemSubtitle}
                        numberOfLines={1}
                        lineBreakMode="tail">
                        {calculateVideoSize(item.length)}
                    </ListItem.Subtitle>
                </ListItem.Content>

                <TouchableOpacity style={contentPoolStyles.deleteButton} onPress={() => _deleteVideo(item.id)}>
                    <MaterialCommunityIcons style={contentPoolStyles.deleteIcon} name="delete" size={32} color="red" />
                </TouchableOpacity>

                <ListItem.Chevron color="white" />
            </ListItem>
        </TouchableOpacity>
    );

    // Info that the list is empty.
    const renderEmptyList = () => {
        return (
            <View style={contentPoolStyles.infoTextBox}>
                <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.noVideosAvailable")}</Text>
            </View>
        );
    };

    return (
        <ImageBackground
            source={require("../../constants/images/Background2.png")}
            style={contentPoolStyles.imageContainer}>
            <Text style={contentPoolStyles.header}>{i18n.t("itrex.videoPool")}</Text>
            {renderVideoUpload()}
            {renderRefreshButton()}
            {renderVideoList()}
        </ImageBackground>
    );

    async function _initVideoUpload() {
        loggerService.trace("Initialising video picker.");
        const filePicker: FilePickerService = new FilePickerService();
        const pickedVideos: File[] = await filePicker.pickFile();

        loggerService.trace("Initialising video upload.");
        await _uploadVideos(pickedVideos);
    }

    async function _uploadVideos(selectedVideos: File[]): Promise<void> {
        setVideoUploading(true);

        for (const selectedVideo of selectedVideos) {
            await _uploadVideo(selectedVideo);
        }

        // Give MediaService 2 seconds to save uploaded videos before getting all videos for list.
        await sleep(2000);
        _resetAnimBeforeGetAllVideos();

        setVideoUploading(false);
        toast.info(i18n.t("itrex.uploadDone"), false);
    }

    async function _uploadVideo(selectedVideo: File): Promise<void> {
        if (selectedVideo == undefined || course.id == undefined) {
            loggerService.warn("Selected video or course ID undefined.");
            return;
        }
        loggerService.trace("Selected video: " + selectedVideo.name);

        const videoFormData: FormData = await buildVideoAsFormData(selectedVideo, course.id);
        const postRequest: RequestInit = RequestFactory.createPostRequestWithFormData(videoFormData);
        await endpointsVideo
            .uploadVideo(
                postRequest,
                i18n.t("itrex.uploadSuccessful") + selectedVideo.name,
                i18n.t("itrex.uploadFailed") + selectedVideo.name
            )
            .then((video) => {
                loggerService.trace("Upload sucessful: " + video.title);
                setVideoListLoading(true);

                if (video.id != undefined) {
                    videos.push(video);
                }

                setVideoListLoading(false);
            });
    }

    function _resetAnimBeforeGetAllVideos() {
        loggerUI.trace("Resetting video list animation.");
        translateY = new Animated.Value(100);
        _getAllVideos();
    }

    async function _getAllVideos(): Promise<void> {
        if (course.id == undefined) {
            loggerService.warn("Course ID undefined, can't get videos.");
            return;
        }
        loggerService.trace("Getting all videos of course: " + course.id);

        setVideoListLoading(true);
        setVideos(initialVideoState);

        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsVideo
            .findAllVideosOfACourse(request, course.id, undefined, i18n.t("itrex.getVideosError"))
            .then((videosReceived: IVideo[]) => {
                setVideos(videosReceived);
                loggerService.trace("Videos received.");
            })
            .finally(async () => setVideoListLoading(false));
    }

    async function _deleteVideo(videoId?: string): Promise<void> {
        if (videoId == undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
        endpointsVideo
            .deleteVideo(deleteRequest, videoId, undefined, i18n.t("itrex.deleteVideoError"))
            .then(() => _getAllVideos());
    }

    function _resetAllStates(): void {
        setVideoUploading(false);
        setVideoListLoading(true);
        setVideos(initialVideoState);
    }

    function _videoListLinesToRender(): number {
        if (Platform.OS === "web") {
            return 50;
        }
        return 3;
    }
};
