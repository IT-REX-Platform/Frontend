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
import { Separator } from "./Separator";
import { useFocusEffect } from "@react-navigation/native";
import { ICourse } from "../types/ICourse";
import { CourseContext, LocalizationContext } from "./Context";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { dark } from "../constants/themes/dark";

const endpointsVideo = new EndpointsVideo();
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");

export const VideoPoolComponent: React.FC = () => {
    loggerService.trace("Started VideoPoolComponent.");
    const navigation = useNavigation();
    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);

    const [isLoading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loggerService.trace("Getting all videos of course: " + course.id);
            getAllVideos(course.id);
        }, [course])
    );

    // Display all videos
    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState(initialVideoState);

    const translateY = useRef(new Animated.Value(100)).current;
    useEffect(() => {
        Animated.timing(translateY, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    });

    const listItem = ({ item }: { item: IVideo }) => (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <Separator />
            <TouchableHighlight
                onPress={() => {
                    navigation.navigate("VIDEO", {
                        video: item,
                    });
                }}>
                <View style={styles.listItem}>
                    <Text>{item.title}</Text>
                </View>
            </TouchableHighlight>
        </Animated.View>
    );

    const renderUi = () => {
        if (isLoading) {
            return (
                <View style={styles.containerCentered}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        if (videos.length < 1) {
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
                    data={videos}
                    renderItem={listItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    };

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <Text style={styles.header}>{i18n.t("itrex.videoPool")}</Text>

            {renderUi()}
        </ImageBackground>
    );

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
        width: "50%",
    },
    listItem: {
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
    },
});
