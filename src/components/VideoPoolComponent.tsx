import React from "react";
import { useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Button,
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TouchableHighlight,
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
import { Avatar, ListItem } from "react-native-elements";

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
    const translateY = useRef(new Animated.Value(100)).current;
    useEffect(() => {
        Animated.timing(translateY, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    });

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
                    <Pressable style={styles.styledButton}>
                        <Button
                            title={i18n.t("itrex.toUploadVideo")}
                            onPress={() => navigation.navigate(NavigationRoutes.ROUTE_VIDEO_UPLOAD)}
                        />
                    </Pressable>

                    <View style={styles.textBox}>
                        <Text style={styles.text}>{i18n.t("itrex.noVideosAvailable")}</Text>
                    </View>
                </View>
            );
        }

        loggerService.trace("Displaying video list.");
        return (
            <View style={styles.containerTop}>
                <Pressable style={styles.styledButton}>
                    <Button
                        title={i18n.t("itrex.toUploadVideo")}
                        onPress={() => navigation.navigate(NavigationRoutes.ROUTE_VIDEO_UPLOAD)}
                    />
                </Pressable>

                <FlatList
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    data={videos}
                    renderItem={listItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    };

    // Creation of each list item.
    const listItem = ({ item }: { item: IVideo }) => (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <TouchableHighlight
                onPress={() => {
                    navigation.navigate("VIDEO", {
                        video: item,
                    });
                }}>
                <ListItem bottomDivider>
                    <Avatar
                        source={{
                            uri:
                                "https://www.pngitem.com/pimgs/m/319-3192070_transparent-video-play-icon-png-png-download.png",
                        }}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                        {/* <ListItem.Subtitle>{item.length}</ListItem.Subtitle> */}
                        {/* <ListItem.Subtitle>{getVideoLength(item.length)}</ListItem.Subtitle> */}
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </TouchableHighlight>
        </Animated.View>
    );

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

    function getVideoLength(videoLength?: number): string {
        if (videoLength == undefined) {
            return "";
        }
        return new Date(videoLength / 100).toISOString().substr(11, 8);
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
    textBox: {
        width: "50%",
        height: "50%",
        backgroundColor: "#eeeeee",
        textAlign: "center",
        justifyContent: "center",
    },
    text: {
        color: "black",
        fontSize: 20,
        margin: 10,
    },
    styledButton: {
        margin: 5,
    },
    list: {
        flexWrap: "wrap",
    },
    listItem: {
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
    },
});
