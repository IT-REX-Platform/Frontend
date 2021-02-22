import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button, FlatList, Pressable, StyleSheet, Text, TouchableHighlight, View, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { loggerFactory } from "../../logger/LoggerConfig";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IVideo } from "../types/IVideo";
import { NavigationProps } from "../types/NavigationProps";

const endpointsVideo = new EndpointsVideo();
const courseUuid = "af45cc33-5ea8-45aa-b878-7105f24343a2"; // TODO: get course ID from context.
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");

const dummyVideos: IVideo[] = [
    {
        id: 1,
        title: "title_1_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        startDate: new Date(),
        endDate: new Date(),
        courseId: "course_ID",
        chapterId: "chapter_ID",
        uploaderId: "uploader_ID",
        mimeType: "video/mp4",
        length: 100,
        width: 640,
        height: 480,
    },
    {
        id: 2,
        title: "title_2_bbbbbbbbbbb",
        startDate: new Date(),
        endDate: new Date(),
        courseId: "course_ID",
        chapterId: "chapter_ID",
        uploaderId: "uploader_ID",
        mimeType: "video/mp4",
        length: 100,
        width: 640,
        height: 480,
    },
    {
        id: 3,
        title: "title_3_cccccccccccccccccccccccccccccccc",
        startDate: new Date(),
        endDate: new Date(),
        courseId: "course_ID",
        chapterId: "chapter_ID",
        uploaderId: "uploader_ID",
        mimeType: "video/mp4",
        length: 100,
        width: 640,
        height: 480,
    },
];

export const VideoPoolComponent: React.FC<NavigationProps> = ({ route }) => {
    loggerService.trace("Started VideoPoolComponent.");

    const navigation = useNavigation();

    React.useContext(LocalizationContext);

    const courseId: string = route.params.courseId;
    console.log(courseId);

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
            <View style={[styles.separator]} />
            <TouchableHighlight onPress={() => navigation.navigate(NavigationRoutes.ROUTE_VIDEO, { video: item })}>
                <View style={styles.listItem}>
                    <Text>{item.title}</Text>
                </View>
            </TouchableHighlight>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <Pressable style={styles.styledButton}>
                <Button title={i18n.t("itrex.getAllVideos")} onPress={getAllVideos}></Button>
            </Pressable>
            <Button
                title={i18n.t("itrex.toUploadVideo")}
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />

            <FlatList data={dummyVideos} renderItem={listItem} keyExtractor={(item, index) => index.toString()} />
        </View>
    );

    async function getAllVideos(): Promise<void> {
        loggerService.trace("Getting all videos of this course.");
        const request: RequestInit = RequestFactory.createGetRequest();
        const response: Promise<IVideo[]> = endpointsVideo.getAllVideos(request, courseUuid);

        await response.then((videosReceived: IVideo[]) => {
            setVideos(videosReceived);
            // videos = videosReceived;
            // loggerService.trace(JSON.stringify(videos));
            // console.log(videos);
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
    separator: {
        width: "100%",
        backgroundColor: "#eeeeee",
        padding: 1,
    },
});
