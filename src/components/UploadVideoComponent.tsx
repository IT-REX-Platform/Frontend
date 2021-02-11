import React, { useState } from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View } from "react-native";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import * as DocumentPicker from "expo-document-picker";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideoExtended } from "../api/endpoints/EndpointsVideoExtended";
import { Video } from "expo-av";

/*TODO: Configure Video-Upload for iOS as specified here: https://docs.expo.io/versions/latest/sdk/document-picker/*/

const endpointsVideoExtended = new EndpointsVideoExtended();

export const UploadVideoComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    const [videoUri, setVideoUri] = useState("");
    const [videoName, setVideoName] = useState("");
    const [videoPlayerUri, setVideoPlayerUri] = useState("");

    const pickDocument = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = {};
        result = await DocumentPicker.getDocumentAsync({ type: "video/mp4" });

        setVideoUri(result.uri);
        setVideoName(result.name);
    };

    const uploadVideo = async () => {
        const video = await buildVideoAsFormData();
        const postRequest = RequestFactory.createPostRequestWithFormData(video);

        const response = await endpointsVideoExtended.uploadVideo(postRequest);

        resetState();

        setVideoPlayerUri(endpointsVideoExtended.getVideoDownloadLink(response["id"]));

        return response;
    };

    const buildVideoAsFormData = async () => {
        const fileBlob = await (await fetch(videoUri)).blob();
        const formData = new FormData();
        formData.append("file", fileBlob, videoName);
        return formData;
    };

    const resetState = () => {
        setVideoUri("");
        setVideoName("");
        setVideoPlayerUri("");
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>{i18n.t("itrex.uploadVideoHere")}</Text>
                    <TextInput value={videoName} style={styles.StyledTextInput} testID="fileNameInput">
                        testtext
                    </TextInput>
                    <Pressable style={styles.StyledButton}>
                        <Button title={i18n.t("itrex.browseFiles")} onPress={pickDocument}></Button>
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
        flexDirection: "row",
        justifyContent: "center",
    },
    StyledTextInput: {
        width: 400,
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
