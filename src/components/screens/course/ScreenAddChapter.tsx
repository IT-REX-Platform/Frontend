/* eslint-disable max-lines */
import {
    ActivityIndicator,
    Animated,
    FlatList,
    ImageBackground,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Button,
} from "react-native";

import React, { ChangeEvent, useEffect, useState } from "react";
import i18n from "../../../locales";
import { dark } from "../../../constants/themes/dark";
import { CourseContext, LocalizationContext } from "../../Context";
import { DatePickerComponent } from "../../DatePickerComponent";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
    CompositeNavigationProp,
    RouteProp,
    useFocusEffect,
    useIsFocused,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { CourseStackParamList, RootDrawerParamList } from "../../../constants/navigators/NavigationRoutes";
import { IChapter } from "../../../types/IChapter";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../../api/endpoints/EndpointsChapter";
import { ICourse } from "../../../types/ICourse";
import { ListItem } from "react-native-elements";
import CourseService from "../../../services/CourseService";
import { IVideo } from "../../../types/IVideo";
import { EndpointsVideo } from "../../../api/endpoints/EndpointsVideo";
import { loggerFactory } from "../../../../logger/LoggerConfig";
import { calculateVideoSize } from "../../../services/calculateVideoSize";
import { createAlert } from "../../../helperScripts/createAlert";

type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "CHAPTER">,
    DrawerNavigationProp<RootDrawerParamList>
>;

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CHAPTER">;

const endpointsVideo = new EndpointsVideo();
export const ScreenAddChapter: React.FC = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();
    const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
    let chapterId = route.params.chapterId;

    if (chapterId == "undefined") {
        chapterId = undefined;
    }
    // Start- and Enddate for a chapter
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    //const [image, setImage] = useState(null);

    // Loading icon state.
    const [isLoading, setLoading] = useState(true);

    // All videos state.
    const initialVideoState: IVideo[] = [];

    // Vertical slide animation for FlatList.
    const translateY = new Animated.Value(100);
    Animated.timing(translateY, { toValue: 1, duration: 500, useNativeDriver: false }).start();

    const course: ICourse = React.useContext(CourseContext);

    const initialCourseName = chapterId == undefined ? "Mein neues Kapitel" : "";
    const chapterEndpoint = new EndpointsChapter();
    const courseService = new CourseService();
    const [chapter, setChapter] = useState<IChapter>({} as IChapter);

    const [chapterName, setChapterName] = useState<string | undefined>(initialCourseName);

    const [contentList, setContentList] = useState<IVideo[]>([]);

    const [videoPoolList, setVideoPoolList] = useState<IVideo[]>([]);

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && course.id !== undefined) {
            console.log("chapter focused");
        }
    }, [isFocused]);

    const startDateChanged = (event: ChangeEvent | Event, selectedDate?: Date) => {
        if (Platform.OS === ("android" || "ios")) {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
        } else {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            const currdate: Date = new Date(target.value);
            setStartDate(currdate);
        }
    };

    const endDateChanged = (event: ChangeEvent | Event, selectedDate?: Date) => {
        if (Platform.OS === ("android" || "ios")) {
            const currentDate = selectedDate || endDate;
            setEndDate(currentDate);
        } else {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            const currdate: Date = new Date(target.value);
            setEndDate(currdate);
        }
    };

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
        if (videoPoolList.length < 1) {
            loggerService.trace("Displaying info box.");
            return (
                <View style={styles.containerTop}>
                    <View style={styles.infoTextBox}>
                        <Text style={styles.infoText}>{i18n.t("itrex.noVideosAvailable")}</Text>
                    </View>
                </View>
            );
        }

        loggerService.trace("Displaying video list.");
        return (
            <View style={styles.containerTop}>
                <Text style={styles.courseHeader}>Available Videos</Text>
                <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "90%" }}>
                    <FlatList
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                        data={videoPoolList}
                        renderItem={listItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </Animated.View>
            </View>
        );
    };

    // Creates a list for the left side, so that videos can be removed
    const listRemoveItem = ({ item }: { item: IVideo }) => (
        <View>
            <ListItem
                containerStyle={{
                    marginBottom: 5,
                    borderRadius: 2,
                    backgroundColor: dark.theme.darkBlue2,
                    borderColor: dark.theme.darkBlue4,
                    borderWidth: 2,
                }}>
                <TouchableOpacity onPress={() => removeContent(item)}>
                    <MaterialIcons name="remove" size={28} color="white" style={styles.icon} />
                </TouchableOpacity>
                <MaterialCommunityIcons name="video-vintage" size={28} color="white" />

                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item.title}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>
                        {calculateVideoSize(item.length)}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </View>
    );

    // Creates a list for the right side, so that videos can be added to a chapter
    const listItem = ({ item }: { item: IVideo }) => (
        <ListItem
            containerStyle={{
                marginBottom: 5,
                borderRadius: 2,
                backgroundColor: dark.theme.darkBlue2,
                borderColor: dark.theme.darkBlue4,
                borderWidth: 2,
            }}>
            <TouchableOpacity onPress={() => addContent(item)}>
                <MaterialIcons name="add" size={28} color="white" style={styles.icon} />
            </TouchableOpacity>
            <MaterialCommunityIcons name="video-vintage" size={28} color="white" />

            <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                    {item.title}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.listItemSubtitle}>{calculateVideoSize(item.length)}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );

    /**
     * Add Video to Chapter List
     * @param video
     */
    function addContent(video: IVideo) {
        const index = videoPoolList.indexOf(video);
        if (index > -1) {
            videoPoolList.splice(index, 1);
        }
        setContentList([...contentList, video]);
    }

    /**
     * Remove Video from Chapter List
     * @param video
     */
    function removeContent(video: IVideo) {
        const index = contentList.indexOf(video);
        if (index > -1) {
            contentList.splice(index, 1);
        }
        setContentList([...contentList]);
        setVideoPoolList([...videoPoolList, video]);
    }

    useEffect(() => {
        console.log(contentList);
    }, [contentList, setContentList, listRemoveItem, listItem, renderUi]);

    // Use the whole structure from the context ??
    useFocusEffect(
        React.useCallback(() => {
            if (chapterId != undefined) {
                loggerService.trace("Getting all videos of course: " + course.id);
                getAllVideos(course.id);
                const request: RequestInit = RequestFactory.createGetRequest();
                chapterEndpoint.getChapter(request, chapterId).then((chapter) => {
                    setChapter(chapter);
                    setChapterName(chapter.title);
                    setStartDate(chapter.startDate);
                    setEndDate(chapter.endDate);
                });
            }
        }, [chapterId])
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../../../constants/images/Background2.png")} style={styles.image}>
                <View style={[styles.headContainer]}>
                    <View style={styles.borderContainer}>
                        {/*<TextInput label="name" value={courseName} onChangeText={(text) => setCourseName(text)}></TextInput>*/}
                        <TextInput
                            style={styles.courseHeader}
                            value={chapterName}
                            onChangeText={(text) => setChapterName(text)}></TextInput>
                        <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                    </View>
                    <View>
                        <Pressable style={{ margin: 5, width: 80 }}>
                            <Button
                                color={dark.Opacity.darkGreen}
                                title="Save"
                                onPress={() => {
                                    // Create new Chapter
                                    if (chapterId == undefined) {
                                        const myNewChapter: IChapter = {
                                            title: chapterName,
                                            startDate: startDate,
                                            endDate: endDate,
                                            courseId: course.id,
                                            // TODO: add the contentAdd List as Content
                                        };
                                        console.log("create");
                                        courseService.createNewChapter(myNewChapter, course).then((chapter) => {
                                            navigation.navigate("CHAPTER", { chapterId: chapter.id });
                                        });
                                    } else {
                                        // Update an existing chapter
                                        chapter.title = chapterName;
                                        chapter.startDate = startDate;
                                        chapter.endDate = endDate;

                                        const patchRequest: RequestInit = RequestFactory.createPatchRequest(chapter);
                                        chapterEndpoint.patchChapter(patchRequest);
                                    }
                                }}
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.headContainer}>
                    <View style={styles.datePicker}>
                        <DatePickerComponent
                            title={i18n.t("itrex.startDate")}
                            date={startDate}
                            onDateChanged={startDateChanged}></DatePickerComponent>
                    </View>
                    <View style={styles.datePicker}>
                        <DatePickerComponent
                            title={i18n.t("itrex.endDate")}
                            date={endDate}
                            onDateChanged={endDateChanged}></DatePickerComponent>
                    </View>
                </View>

                <View style={styles.videoContainer}>
                    <View style={styles.sequenceArea}>
                        <View style={styles.containerTop}>
                            <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "200%" }}>
                                <FlatList
                                    style={styles.list}
                                    showsVerticalScrollIndicator={false}
                                    data={contentList}
                                    renderItem={listRemoveItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </Animated.View>
                        </View>
                    </View>
                    {renderUi()}
                </View>
            </ImageBackground>
        </View>
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
                setVideoPoolList(videosReceived);
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
        flex: 4,
        flexDirection: "column",
        backgroundColor: dark.theme.darkBlue1,
    },
    headContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingTop: "3%",
        paddingLeft: "3%",
    },
    borderContainer: {
        flex: 3,
        flexDirection: "row",
        borderBottomColor: "rgba(70,74,91,0.5)",
        borderBottomWidth: 3,
    },
    datePicker: {
        marginRight: "3%",
        position: "relative",
    },
    videoContainer: {
        flex: 2,
        flexDirection: "row",
        paddingLeft: "3%",
        paddingTop: "3%",
        paddingBottom: "3%",
    },
    sequenceArea: {
        flex: 3,
        backgroundColor: "rgba(1,43,86,0.5)",
        borderWidth: 3,
        borderColor: dark.theme.darkBlue3,
        marginRight: "3%",
        alignItems: "center",
    },
    courseHeader: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
        // eslint-disable-next-line max-lines
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },
    containerCentered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    containerTop: {
        flex: 1,
        alignItems: "center",
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
});
