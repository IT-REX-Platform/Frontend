import React, { useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LocalizationContext } from "../App";
import { loggerFactory } from "../../logger/LoggerConfig";
import { IVideo } from "../types/IVideo";
import { NavigationProps } from "../types/NavigationProps";
import { Video } from "expo-av";
import { createVideoUrl } from "../services/createVideoUrl";
import { createAlert } from "../helperScripts/createAlert";
import i18n from "../locales";
import { Separator } from "./Separator";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { useNavigation, useRoute } from "@react-navigation/native";

const loggerService = loggerFactory.getLogger("service.VideoComponent");
const endpointsVideo = new EndpointsVideo();

export const VideoComponent: React.FC = () => {
    loggerService.trace("Started VideoComponent.");
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const route = useRoute();
    const video: IVideo = route.params.video;
    console.log(video);

    const [newTitle, setTitle] = useState("");

    return (
        <View style={styles.verticalContainer}>
            <Video
                source={{ uri: getVideoUrl() }}
                // source={{
                //     uri: "https://cdn.videvo.net/videvo_files/video/free/2012-10/small_watermarked/hd1967_preview.webm",
                // }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={true}
                useNativeControls={true}
                style={{ width: getWidth(), height: getHeight(), padding: 10, backgroundColor: "#481380" }}
            />

            <Separator />
            <View style={styles.horizontalContainer}>
                <Text style={styles.label}>{i18n.t("itrex.titleColon")}</Text>
                <Text style={styles.text}>{getTitle()}</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder={i18n.t("itrex.inputNewTitle")}
                    onChangeText={(text: string) => setTitle(text)}
                />
            </View>

            <Separator />
            <View style={styles.horizontalContainer}>
                <Text style={styles.label}>{i18n.t("itrex.startDateColumn")}</Text>
                <Text style={styles.text}>{getStartDate()}</Text>
            </View>

            <Separator />
            <View style={styles.horizontalContainer}>
                <View style={styles.horizontalContainer}>
                    <Text style={styles.label}>{i18n.t("itrex.endDateColumn")}</Text>
                    <Text style={styles.text}>{getEndDate()}</Text>
                </View>
            </View>

            <Separator />
            <View style={styles.horizontalContainer}>
                <Pressable style={styles.button}>
                    <Button title={i18n.t("itrex.updateVideo")} onPress={updateVideo} />
                </Pressable>
                <Pressable style={styles.button}>
                    <Button color="red" title={i18n.t("itrex.deleteVideo")} onPress={deleteVideo} />
                </Pressable>
            </View>
        </View>
    );

    function getVideoUrl(): string {
        if (video.id == undefined || null) {
            createAlert(i18n.t("itrex.videoNotFound"));
            return "";
        }

        return createVideoUrl(video.id);
    }

    function getWidth(): number {
        if (video.width == undefined || null) {
            return 640;
        }
        return video.width;
    }

    function getHeight(): number {
        if (video.height == undefined || null) {
            return 480;
        }
        return video.height;
    }

    function getTitle(): string {
        if (video.title == undefined || null) {
            return "-";
        }
        return video.title;
    }

    function getStartDate(): string {
        if (video.startDate == undefined || null) {
            return "-";
        }
        return video.startDate.toString();
    }

    function getEndDate(): string {
        if (video.endDate == undefined || null) {
            return "-";
        }
        return video.endDate.toString();
    }

    async function updateVideo(): Promise<void> {
        const videoUpdate: IVideo = {
            id: video.id,
        };

        if (newTitle !== "") {
            videoUpdate.title = newTitle;
        }

        // TODO: add more video fields to update here. @s.pastuchov 22.02.21

        const postRequest: RequestInit = RequestFactory.createPatchRequest(videoUpdate);
        const response: IVideo = await endpointsVideo.patchVideo(postRequest);
        console.log(response);

        createAlert(i18n.t("itrex.videoUpdated"));

        if (video.courseId !== undefined) {
            const courseId: string = video.courseId;
            navigation.navigate(NavigationRoutes.ROUTE_VIDEO_POOL, { courseId });
        }
    }

    async function deleteVideo(): Promise<void> {
        if (video.id === undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
        endpointsVideo.deleteVideo(deleteRequest, video.id);

        createAlert(i18n.t("itrex.videoDeleted"));

        if (video.courseId !== undefined) {
            const courseId: string = video.courseId;
            navigation.navigate(NavigationRoutes.ROUTE_VIDEO_POOL, { courseId });
        }
    }
};

const styles = StyleSheet.create({
    verticalContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    horizontalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    label: {
        color: "black",
        fontSize: 20,
        padding: 5,
        fontWeight: "bold",
    },
    text: {
        color: "black",
        fontSize: 20,
        padding: 5,
    },
    textInput: {
        fontSize: 20,
        marginLeft: 8,
        borderColor: "lightgray",
        borderWidth: 2,
    },
    button: {
        margin: 10,
    },
});
