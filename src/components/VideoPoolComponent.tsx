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
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { loggerFactory } from "../../logger/LoggerConfig";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IVideo } from "../types/IVideo";
import { NavigationProps } from "../types/NavigationProps";
import { Separator } from "./Separator";

const endpointsVideo = new EndpointsVideo();
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");

// TODO: delete dummy;
// const dummyVideos: IVideo[] = [
//     {
//         id: "video_ID_1",
//         title: "title_1_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
//         startDate: new Date(),
//         endDate: new Date(),
//         courseId: "course_ID_1",
//         chapterId: "chapter_ID_1",
//         uploaderId: "uploader_ID_1",
//         mimeType: "video/mp4",
//         length: 100,
//         width: 640,
//         height: 480,
//     },
//     {
//         id: "video_ID_2",
//         title: "title_2_bbbbbbbbbbb",
//         startDate: new Date(),
//         endDate: new Date(),
//         courseId: "course_ID_2",
//         chapterId: "chapter_ID_2",
//         uploaderId: "uploader_ID_2",
//         mimeType: "video/mp4",
//         length: 100,
//         width: 640,
//         height: 480,
//     },
//     {
//         id: "video_ID_3",
//         title: "title_3_cccccccccccccccccccccccccccccccc",
//         startDate: new Date(),
//         endDate: new Date(),
//         courseId: "course_ID_3",
//         chapterId: "chapter_ID_3",
//         uploaderId: "uploader_ID_3",
//         mimeType: "video/mp4",
//         length: 100,
//         width: 640,
//         height: 480,
//     },
// ];

export const VideoPoolComponent: React.FC<NavigationProps> = ({ route }) => {
    loggerService.trace("Started VideoPoolComponent.");
    const navigation = useNavigation();
    React.useContext(LocalizationContext);

    const [isLoading, setLoading] = useState(true);

    const courseId: string = route.params.courseId;
    loggerService.trace("Course ID: " + courseId);

    React.useEffect(() => {
        loggerService.trace("Getting all videos of course: " + courseId);
        getAllVideos();
    }, []);

    // Display all videos
    const initialVideoState: IVideo[] = [];
    const [videos, setVideos] = useState(initialVideoState);

    // const translateY = useRef(new Animated.Value(Dimensions.get("window").height)).current;
    const translateY = useRef(new Animated.Value(100)).current;
    useEffect(() => {
        Animated.timing(translateY, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    });

    // const translateX = useRef(new Animated.Value(100)).current;
    // const fadeOut = () => {
    //     // Will change fadeAnim value to 0 in 5 seconds
    //     Animated.timing(translateX, {
    //         toValue: 0,
    //         duration: 2000,
    //     }).start();
    // };

    const listItem = ({ item }: { item: IVideo }) => (
        // <Animated.View style={{ transform: [{ translateX: translateY }] }}>
        <Animated.View style={{ transform: [{ translateY }] }}>
            <Separator />
            <TouchableHighlight onPress={() => navigation.navigate(NavigationRoutes.ROUTE_VIDEO, { video: item })}>
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
            {/* <Pressable style={styles.styledButton}>
                <Button title={i18n.t("itrex.getAllVideos")} onPress={getAllVideos} />
            </Pressable> */}

            <Pressable style={styles.styledButton}>
                <Button
                    title={i18n.t("itrex.toUploadVideo")}
                    onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO, { courseId })}
                />
            </Pressable>

            <FlatList data={videos} renderItem={listItem} keyExtractor={(item, index) => index.toString()} />
            {/* <FlatList data={dummyVideos} renderItem={listItem} keyExtractor={(item, index) => index.toString()} /> */}
        </View>
    );

    async function getAllVideos(): Promise<void> {
        const request: RequestInit = RequestFactory.createGetRequest();
        const response: Promise<IVideo[]> = endpointsVideo.getAllVideos(request, courseId);

        await response
            .then((videosReceived: IVideo[]) => {
                setVideos(videosReceived);
                // loggerService.trace(JSON.stringify(videosReceived));
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
