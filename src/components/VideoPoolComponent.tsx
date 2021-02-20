import React from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { loggerFactory } from "../../logger/LoggerConfig";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IVideo } from "../types/IVideo";

const endpointsVideo = new EndpointsVideo();
const courseUuid = "af45cc33-5ea8-45aa-b878-7105f24343a2"; // TODO: get course ID from context.
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");

export const VideoPoolComponent: React.FC = () => {
    loggerService.trace("Started VideoPoolComponent.");

    const navigation = useNavigation();

    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <Pressable style={styles.styledButton}>
                <Button title={i18n.t("itrex.getAllVideos")} onPress={getAllVideos}></Button>
            </Pressable>

            <Button
                title={i18n.t("itrex.toUploadVideo")}
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />
        </View>
    );
};

function getAllVideos(): void {
    loggerService.trace("Getting all videos of this course.");
    const request: RequestInit = RequestFactory.createGetRequest();
    const videos: Promise<IVideo[]> = endpointsVideo.getAllVideos(request, courseUuid);

    videos.then((receivedVideos) => {
        console.log(receivedVideos); // TODO
    });
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    styledButton: {
        margin: 5,
    },
});
