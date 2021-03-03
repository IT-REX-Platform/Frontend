import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loggerFactory } from "../../logger/LoggerConfig";
import { IVideo } from "../types/IVideo";
import { Video } from "expo-av";
import { createVideoUrl } from "../services/createVideoUrl";
import { createAlert } from "../helperScripts/createAlert";
import i18n from "../locales";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LocalizationContext } from "./Context";
import { CourseStackParamList, RootDrawerParamList } from "../constants/navigators/NavigationRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { dark } from "../constants/themes/dark";
import { calculateVideoSize } from "../services/calculateVideoSize";
import { ScrollView } from "react-native-gesture-handler";

const loggerService = loggerFactory.getLogger("service.VideoComponent");
const endpointsVideo = new EndpointsVideo();

type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "VIDEO">,
    DrawerNavigationProp<RootDrawerParamList>
>;

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "VIDEO">;

export const VideoComponent: React.FC = () => {
    loggerService.trace("Started VideoComponent.");
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const route = useRoute<ScreenCourseTabsRouteProp>();
    const video: IVideo = route.params.video;
    console.log(video);

    const [newTitle, setTitle] = useState("");

    return (
        <ImageBackground style={styles.imageContainer} source={require("../constants/images/Background2.png")}>
            <Text style={styles.header} numberOfLines={1} lineBreakMode="tail">
                {getTitle()}
            </Text>

            <Video
                style={styles.videoStyle}
                source={{ uri: getVideoUrl() }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay={false}
                useNativeControls={true}
            />

            <View style={styles.infoContainer}>
                <TextInput
                    style={styles.textInput}
                    textAlign="center"
                    placeholder={i18n.t("itrex.inputNewTitle")}
                    onChangeText={(text: string) => setTitle(text)}
                />

                <Text style={styles.text}>{calculateVideoSize(video.length)}</Text>

                <View style={styles.horizontalContainer}>
                    <TouchableOpacity style={styles.button} onPress={updateVideo}>
                        <Text style={styles.buttonText}>{i18n.t("itrex.update")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonDelete} onPress={deleteVideo}>
                        <Text style={styles.buttonText}>{i18n.t("itrex.delete")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );

    function getVideoUrl(): string {
        if (video.id == undefined || null) {
            createAlert(i18n.t("itrex.videoNotFound"));
            return "";
        }

        return createVideoUrl(video.id);
    }

    function getTitle(): string {
        if (video.title == undefined || null) {
            return "-";
        }
        return video.title;
    }

    // function getStartDate(): string {
    //     if (video.startDate == undefined || null) {
    //         return "-";
    //     }
    //     return video.startDate.toString();
    // }

    // function getEndDate(): string {
    //     if (video.endDate == undefined || null) {
    //         return "-";
    //     }
    //     return video.endDate.toString();
    // }

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
            navigation.navigate("VIDEO_POOL");
        }
    }

    async function deleteVideo(): Promise<void> {
        if (video.id === undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
        const response: Promise<Response> = endpointsVideo.deleteVideo(deleteRequest, video.id);
        response.then(() => {
            createAlert(i18n.t("itrex.videoDeleted"));
            navigation.navigate("VIDEO_POOL");
        });
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        alignItems: "center",
    },
    header: {
        maxWidth: "95%",
        textAlign: "center",
        fontSize: 50,
        color: dark.theme.pink,
    },
    videoStyle: {
        maxWidth: "50%",
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "black",
    },
    infoContainer: {
        width: "95%",
        alignItems: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    textInput: {
        width: "100%",
        margin: 5,
        fontSize: 20,
        textAlign: "center",
        color: "white",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 2,
    },
    text: {
        maxWidth: "100%",
        margin: 5,
        fontSize: 20,
        textAlign: "center",
        color: "white",
    },
    horizontalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    button: {
        margin: 5,
        backgroundColor: dark.theme.darkBlue4,
        borderRadius: 2,
    },
    buttonDelete: {
        margin: 5,
        backgroundColor: "red",
        borderRadius: 2,
    },
    buttonText: {
        padding: 10,
        fontSize: 20,
        color: "white",
    },
});
