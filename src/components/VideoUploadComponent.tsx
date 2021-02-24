import React, { useState, useEffect } from "react";
import i18n from "../locales";
import { Header } from "../constants/navigators/Header";
import { CourseContext, LocalizationContext } from "./Context";
import { Button, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { createAlert } from "../helperScripts/createAlert";
import { Video } from "expo-av";
import { IVideo } from "../types/IVideo";
import { VideoFormDataParams } from "../constants/VideoFormDataParams";
import { loggerFactory } from "../../logger/LoggerConfig";
import { createVideoUrl } from "../services/createVideoUrl";
import { ICourse } from "../types/ICourse";

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
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const video: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
        });

        if (video.cancelled === true) {
            return;
        }

        setVideoUri(video.uri);
        setVideoName("video selected");
    };

    /**
     * Expo document picker that only allows picking of video files in mp4 format.
     */
    const documentPicker = async () => {
        const document: DocumentPicker.DocumentResult = await DocumentPicker.getDocumentAsync({
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

        const video = await buildVideoAsFormData(course.id);
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
    const buildVideoAsFormData = async (courseId: string) => {
        const response: Response = await fetch(videoUri);
        const fileBlob: Blob = await response.blob();
        const formData: FormData = new FormData();
        formData.append(VideoFormDataParams.PARAM_VIDEO_FILE, fileBlob);
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
                <View style={styles.styledInputContainer}>
                    <Text style={{ color: "white" }}>{i18n.t("itrex.uploadVideoHere")}</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        value={videoName}
                        editable={false}
                        testID="videoNameInput"></TextInput>
                    <Pressable style={styles.styledButton}>
                        <Button title={i18n.t("itrex.browseVideos")} onPress={pickVideo}></Button>
                    </Pressable>
                </View>

                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.toUploadVideo")} onPress={uploadVideo}></Button>
                </Pressable>

                <View style={styles.video} />

                <Video
                    source={{ uri: videoPlayerUri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={true}
                    useNativeControls={true}
                    style={{ width: 640, height: 480 }}
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
        justifyContent: "center",
    },
    styledInputContainer: {
        flexDirection: "column",
        justifyContent: "center",
        tintColor: "white",
    },
    styledTextInput: {
        tintColor: "white",
        width: "100%",
        marginLeft: 8,
        marginRight: 8,
        borderColor: "lightgray",
        borderWidth: 2,
    },
    styledButton: {
        marginTop: 16,
    },
    video: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: "center",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
});
