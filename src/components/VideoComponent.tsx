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

    // Video.
    const videoView = () => (
        <Video
            style={styles.video}
            source={{ uri: getVideoUrl() }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay={false}
            useNativeControls={true}
        />
    );

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <View style={styles.container}>
                <Text numberOfLines={1} lineBreakMode="tail" style={styles.header}>
                    {video.title}
                </Text>

                {videoView()}

                <View style={styles.infoContainer}>
                    <TextInput
                        style={styles.textInput}
                        textAlign="center"
                        placeholder={i18n.t("itrex.inputNewTitle")}
                        onChangeText={(text: string) => setTitle(text)}
                    />
                    <Text style={styles.text}>{calculateVideoSize(video.length)}</Text>
                </View>

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

    // function getWidth(): number {
    //     if (video.width == undefined || null) {
    //         return 640;
    //     }
    //     return video.width;
    // }

    // function getHeight(): number {
    //     if (video.height == undefined || null) {
    //         return 480;
    //     }
    //     return video.height;
    // }

    // function getTitle(): string {
    //     if (video.title == undefined || null) {
    //         return "-";
    //     }
    //     return video.title;
    // }

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
    container: {
        flex: 1,
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
    video: {
        maxWidth: "90%",
        margin: 10,
    },
    infoContainer: {
        width: "90%",
        alignItems: "center",
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        padding: 5,
        borderRadius: 2,
    },
    textInput: {
        color: "white",
        fontSize: 20,
        borderColor: "lightgray",
        borderWidth: 1,
        width: "50%",
        textAlign: "center",
        margin: 5,
    },
    text: {
        color: "white",
        fontSize: 20,
        maxWidth: "85%",
        textAlign: "center",
        margin: 5,
    },
    horizontalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    button: {
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.pink,
        borderWidth: 1,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDelete: {
        backgroundColor: dark.theme.pink,
        borderColor: dark.theme.darkBlue3,
        borderWidth: 1,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
});
