import React, { useState, useEffect } from "react";
import i18n from "../locales";
import { CourseContext, LocalizationContext } from "./Context";
import { Button, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import {
    ImagePickerResult,
    launchImageLibraryAsync,
    MediaTypeOptions,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { createAlert } from "../helperScripts/createAlert";
import { Video } from "expo-av";
import { IVideo } from "../types/IVideo";
import { VideoFormDataParams } from "../constants/VideoFormDataParams";
import { loggerFactory } from "../../logger/LoggerConfig";
import { createVideoUrl } from "../services/createVideoUrl";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";

const loggerService = loggerFactory.getLogger("service.UploadVideoComponent");
const endpointsVideo = new EndpointsVideo();

export const VideoUploadComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);

    loggerService.trace("Course ID: " + course.id);

    const [videoUri, setVideoUri] = useState("");
    const [videoName, setVideoName] = useState("");
    const [videoPlayerUri, setVideoPlayerUri] = useState("");

    /**
     * Make sure that the necessary permissions are given for the image picker.
     */
    useEffect(() => {
        (async () => {
            if (Platform.OS === "ios") {
                const { status } = await requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert(i18n.t("itrex.imagePickerPermAlert"));
                }
            }
        })();
    }, []);

    /**
     * Pick a video.
     * For ios use expo image picker.
     * For web and android use expo document picker.
     */
    const pickVideo = async () => {
        if (Platform.OS !== "ios") {
            documentPicker();
        } else {
            imagePicker();
        }
    };

    /**
     * Expo image picker that only allows picking of video files.
     */
    const imagePicker = async () => {
        const video: ImagePickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Videos,
            allowsEditing: true,
        });

        if (video.cancelled === true) {
            return;
        }

        setVideoUri(video.uri);
        setVideoName("Unnamed video file");
    };

    /**
     * Expo document picker that only allows picking of video files in mp4 format.
     */
    const documentPicker = async () => {
        const document: DocumentResult = await getDocumentAsync({
            type: "video/mp4",
        });

        if (document.type === "cancel") {
            return;
        }

        setVideoUri(document.uri);
        setVideoName(document.name);
    };

    /**
     * Upload the picked video to the backend.
     * If no video was selected previously do nothing.
     */
    const uploadVideo = async (): Promise<void> => {
        if (videoUri === "" || course.id === undefined) {
            return;
        }

        const video: FormData = await buildVideoAsFormData(course.id);
        const postRequest: RequestInit = RequestFactory.createPostRequestWithFormData(video);
        const response: IVideo = await endpointsVideo.uploadVideo(postRequest);
        console.log(response);

        resetVideoState();
        createAlert(i18n.t("itrex.uploadVideoSuccessMsg"));

        if (response.id == null) {
            return;
        }
        const videoUrl: string = createVideoUrl(response.id);
        console.log(videoUrl);
        setVideoPlayerUri(videoUrl);
    };

    /**
     * Build a FormData object from the video uri.
     */
    const buildVideoAsFormData = async (courseId: string): Promise<FormData> => {
        const response: Response = await fetch(videoUri);
        const fileBlob: Blob = await response.blob();
        const formData: FormData = new FormData();
        formData.append(VideoFormDataParams.PARAM_VIDEO_FILE, fileBlob, videoName);
        formData.append(VideoFormDataParams.PARAM_COURSE_ID, courseId);
        return formData;
    };

    const resetVideoState = () => {
        setVideoUri("");
        setVideoName("");
        setVideoPlayerUri("");
    };

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <View style={styles.container}>
                <Text numberOfLines={1} lineBreakMode="tail" style={styles.header}>
                    {i18n.t("itrex.toUploadVideo")}
                </Text>

                <TextInput
                    style={styles.textInput}
                    value={videoName}
                    editable={false}
                    placeholder={i18n.t("itrex.uploadVideoHere")}
                    testID="videoNameInput"
                />

                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.browseVideos")} onPress={pickVideo} />
                </Pressable>

                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.toUploadVideo")} onPress={uploadVideo} />
                </Pressable>

                <Video
                    style={styles.video}
                    source={{ uri: videoPlayerUri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    shouldPlay={false}
                    useNativeControls={true}
                />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        alignItems: "center",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    header: {
        fontSize: 50,
        color: dark.theme.pink,
        textAlign: "center",
        maxWidth: "90%",
    },
    textInput: {
        color: "white",
        fontSize: 24,
        borderColor: "lightgray",
        borderWidth: 1,
        width: "50%",
        textAlign: "center",
        margin: 10,
    },
    styledButton: {
        margin: 10,
    },
    video: {
        maxWidth: "90%",
        margin: 10,
    },
});
