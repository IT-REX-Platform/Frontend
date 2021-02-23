import React from "react";
import { useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Button,
    FlatList,
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

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#481380" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.styledButton}>
                <Button
                    title={i18n.t("itrex.toUploadVideo")}
                    onPress={() => navigation.navigate(NavigationRoutes.ROUTE_VIDEO_UPLOAD)}
                />
            </Pressable>

            <FlatList data={videos} renderItem={listItem} keyExtractor={(item, index) => index.toString()} />
        </View>
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
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    styledButton: {
        margin: 5,
    },
    listItem: {
        backgroundColor: "white",
        paddingTop: 10,
        paddingBottom: 10,
        paddingStart: 20,
        paddingEnd: 20,
    },
});
