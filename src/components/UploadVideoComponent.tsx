import React, { useState, useEffect } from "react";
import { StyleSheet, Button, Platform, Pressable, TextInput, Text, View } from "react-native";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { createAlert } from "../helperScripts/createAlert";
import { Video } from "expo-av";

const endpointsVideo = new EndpointsVideo();

export const UploadVideoComponent: React.FC = () => {
    React.useContext(LocalizationContext);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let video: any = {};
        video = await ImagePicker.launchImageLibraryAsync({
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let document: any = {};
        document = await DocumentPicker.getDocumentAsync({
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
     * If no video was selected previously do
     */
    const uploadVideo = async () => {
        if (videoUri === "") {
            return;
        }

        const video = await buildVideoAsFormData();
        const postRequest = RequestFactory.createPostRequestWithFormData(video);
        const response = await endpointsVideo.uploadVideo(postRequest);

        resetVideoState();
        createAlert(i18n.t("itrex.uploadVideoSuccessMsg"));

        setVideoPlayerUri(endpointsVideo.getVideoDownloadLink(response.id));

        return response;
    };

    /**
     * Build a FormData object from the video uri.
     */
    const buildVideoAsFormData = async () => {
        const fileBlob = await (await fetch(videoUri)).blob();
        const formData = new FormData();
        formData.append("file", fileBlob);
        return formData;
    };

    const resetVideoState = () => {
        setVideoUri("");
        setVideoName("");
        setVideoPlayerUri("");
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>{i18n.t("itrex.uploadVideoHere")}</Text>
                    <TextInput
                        style={styles.StyledTextInput}
                        value={videoName}
                        editable={false}
                        testID="videoNameInput"></TextInput>
                    <Pressable style={styles.StyledButton}>
                        <Button title={i18n.t("itrex.browseVideos")} onPress={pickVideo}></Button>
                    </Pressable>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title={i18n.t("itrex.toUploadVideo")} onPress={uploadVideo}></Button>
                </Pressable>
                <View style={styles.video}></View>
                <Video
                    source={{ uri: videoPlayerUri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={true}
                    useNativeControls={true}
                    style={{ width: 640, height: 360 }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    StyledInputContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
    StyledTextInput: {
        width: "100%",
        marginLeft: 8,
        marginRight: 8,
        borderColor: "lightgray",
        borderWidth: 2,
    },
    StyledButton: {
        marginTop: 16,
    },
    video: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: "center",
    },
});
