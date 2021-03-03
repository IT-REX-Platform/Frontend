import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    ImageBackground,
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
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { dark } from "../constants/themes/dark";
import { ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calculateVideoSize } from "../services/calculateVideoSize";
import { TextButton } from "./UIElements/TextButton";

const endpointsVideo = new EndpointsVideo();
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");

export const VideoPoolComponent: React.FC = () => {
    loggerService.trace("Started VideoPoolComponent.");

    // Navigation hook.
    const navigation = useNavigation();

    // Get localization from context.
    React.useContext(LocalizationContext);

    // Get course infos from context.
    const course: ICourse = React.useContext(CourseContext);

    // Call getAllVideos() only once when this screen is shown.
    useFocusEffect(
        React.useCallback(() => {
            loggerService.trace("Getting all videos of course: " + course.id);
            getAllVideos(course.id);
        }, [course])
    );

    // Loading icon state.
    const [isLoading, setLoading] = useState(true);

    // All videos state.
    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState(initialVideoState);

    // Vertical slide animation for FlatList.
    const translateY = new Animated.Value(100);
    Animated.timing(translateY, { toValue: 1, duration: 500, useNativeDriver: false }).start();

    // Creation of each item of video list.
    const listItem = ({ item }: { item: IVideo }) => (
        <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
                resetStates();
                navigation.navigate("VIDEO", { video: item });
            }}>
            <ListItem
                containerStyle={{
                    marginBottom: 5,
                    borderRadius: 2,
                    backgroundColor: dark.theme.darkBlue2,
                    borderColor: dark.theme.darkBlue4,
                    borderWidth: 2,
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

    // Button to access video upload.
    const uploadButton = () => (
        <TextButton
            title={i18n.t("itrex.toUploadVideo")}
            onPress={() => {
                resetStates();
                navigation.navigate(NavigationRoutes.ROUTE_VIDEO_UPLOAD);
            }}
        />
    );

    // Button to refresh video list.
    const refreshButton = () => (
        <TouchableOpacity style={styles.refreshButton} onPress={() => getAllVideos(course.id)}>
            <MaterialCommunityIcons name="refresh" size={32} color="white" />
        </TouchableOpacity>
    );

    // Render UI according to un-/available videos data.
    const renderUi = () => {
        // Display loading icon if getAllVideos() request is still processing.
        if (isLoading) {
            loggerService.trace("Displaying loading icon.");
            return (
                <View style={styles.containerCentered}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        // Display info box if there are no videos.
        if (videos.length < 1) {
            loggerService.trace("Displaying info box.");
            return (
                <View style={styles.containerTop}>
                    {uploadButton()}
                    {refreshButton()}

                    <View style={styles.infoTextBox}>
                        <Text style={styles.infoText}>{i18n.t("itrex.noVideosAvailable")}</Text>
                    </View>
                </View>
            );
        }

        loggerService.trace("Displaying video list.");
        return (
            <View style={styles.containerTop}>
                {uploadButton()}
                {refreshButton()}

                <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "90%" }}>
                    <FlatList
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                        data={videos}
                        renderItem={listItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Animated.View>
            </View>
        );
    };

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <Text style={styles.header}>{i18n.t("itrex.videoPool")}</Text>
            {renderUi()}
        </ImageBackground>
    );

    /**
     * Method gets all videos belonging to specified course ID.
     *
     * @param courseId ID of the course to which the videos belong.
     */
    async function getAllVideos(courseId?: string): Promise<void> {
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
                setLoading(false);
            });
    }

    // function calculateVideoDuration(videoDuration?: number): string {
    //     if (videoDuration == undefined) {
    //         return "";
    //     }
    //     return new Date(videoDuration / 100).toISOString().substr(11, 8);
    // }

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

    function resetStates(): void {
        setLoading(true);
        setVideos([]);
    }
};

const styles = StyleSheet.create({
    containerCentered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    containerTop: {
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
    },
    infoTextBox: {
        width: "50%",
        height: "50%",
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        textAlign: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    infoText: {
        color: "white",
        fontSize: 20,
        margin: 10,
    },
    refreshButton: {
        padding: 20,
    },
    list: {
        flex: 1,
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
