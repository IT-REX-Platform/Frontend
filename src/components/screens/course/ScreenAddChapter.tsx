/* eslint-disable complexity */
/* eslint-disable max-lines */
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { ChangeEvent, useState } from "react";
import i18n from "../../../locales";
import { dark } from "../../../constants/themes/dark";
import { CourseContext, LocalizationContext } from "../../Context";
import { DatePickerComponent } from "../../DatePickerComponent";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CompositeNavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
import { Event } from "@react-native-community/datetimepicker";
import DraggableFlatList from "react-native-draggable-flatlist";
import { TextButton } from "../../uiElements/TextButton";
import { validateCourseDates } from "../../../helperScripts/validateCourseDates";

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

    const course: ICourse = React.useContext(CourseContext);

    const initialCourseName = chapterId == undefined ? i18n.t("itrex.myNewChapter") : "";
    const chapterEndpoint = new EndpointsChapter();
    const courseService = new CourseService();
    const [chapter, setChapter] = useState<IChapter>({} as IChapter);

    const [chapterName, setChapterName] = useState<string | undefined>(initialCourseName);

    const [contentList, setContentList] = useState<IVideo[]>([]);

    const [videoPoolList, setVideoPoolList] = useState<IVideo[]>([]);

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

        loggerService.trace("Displaying video list.");
        return (
            <View style={styles.containerTop}>
                <FlatList
                    style={styles.list}
                    showsVerticalScrollIndicator={true}
                    data={videoPoolList}
                    renderItem={listItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={emptyList}
                />
            </View>
        );
    };

    // Creates a list for the left side, so that videos can be removed
    const listRemoveItem = ({ item, drag }: { item: IVideo; drag: undefined }) => (
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
                    <TouchableOpacity onLongPress={drag}>
                        <ListItem.Title style={styles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                            {item.title}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.listItemSubtitle}>
                            {calculateVideoSize(item.length)}
                        </ListItem.Subtitle>
                    </TouchableOpacity>
                </ListItem.Content>
                <ListItem.Chevron onPress={() => navigation.navigate("VIDEO", { video: item })} />
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

            <ListItem.Chevron
                style={{ padding: 5 }}
                onPress={() => {
                    navigation.navigate("VIDEO", { video: item });
                }}
            />
        </ListItem>
    );

    // Info that the list is empty.
    const emptyList = () => {
        return (
            <View style={styles.infoTextBox}>
                <Text style={styles.infoText}>{i18n.t("itrex.noVideosAvailable")}</Text>
            </View>
        );
    };

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

    // Use the whole structure from the context ??
    useFocusEffect(
        React.useCallback(() => {
            if (chapterId != undefined) {
                loggerService.trace("Getting all videos of course: " + course.id);

                const request: RequestInit = RequestFactory.createGetRequest();
                chapterEndpoint.getChapter(request, chapterId).then((chapter) => {
                    setChapter(chapter);
                    setChapterName(chapter.title);
                    setStartDate(chapter.startDate);
                    setEndDate(chapter.endDate);

                    getAllVideos(course.id).then((videos) => {
                        // Are there already contents in this chapter ?
                        if (chapter.contents !== undefined) {
                            const newContentList: IVideo[] = [];
                            // Remove assigned contents from the pool, and add those to the "contentList"
                            for (const contentId of chapter.contents) {
                                const videoInPool = videos.findIndex((content) => content.id === contentId);

                                if (videoInPool !== -1) {
                                    // Add To Content-List
                                    newContentList.push(videos[videoInPool]);
                                    // Remove from Pool-List
                                    videos.splice(videoInPool, 1);
                                }
                            }
                            setContentList(newContentList);
                            setVideoPoolList([...videos]);
                        }
                    });
                });
            } else {
                getAllVideos(course.id);
            }
        }, [chapterId])
    );

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../../../constants/images/Background2.png")} style={styles.image}>
                <View style={[styles.headContainer]}>
                    <View style={styles.borderContainer}>
                        {/*<TextInput label="name" value={courseName} onChangeText={(text) => setCourseName(text)} />*/}
                        <TextInput
                            style={styles.courseHeader}
                            value={chapterName}
                            onChangeText={(text) => setChapterName(text)}
                        />
                        <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                    </View>
                    <View>
                        <TextButton title={i18n.t("itrex.save")} onPress={() => saveChapter()} />
                    </View>
                </View>

                <View style={styles.headContainer}>
                    <View style={styles.datePicker}>
                        <DatePickerComponent
                            title={i18n.t("itrex.startDate")}
                            date={startDate}
                            onDateChanged={startDateChanged}
                        />
                    </View>
                    <View style={styles.datePicker}>
                        <DatePickerComponent
                            title={i18n.t("itrex.endDate")}
                            date={endDate}
                            onDateChanged={endDateChanged}
                        />
                    </View>
                </View>

                <View style={styles.videoContainer}>
                    <View style={styles.sequenceArea}>
                        <View style={styles.containerTop}>
                            <DraggableFlatList
                                style={styles.list}
                                showsVerticalScrollIndicator={true}
                                data={contentList}
                                renderItem={listRemoveItem}
                                keyExtractor={(item, index) => index.toString()}
                                onDragEnd={({ to, from }) => reorderContent(to, from)}
                            />
                        </View>
                    </View>
                    {renderUi()}
                </View>
            </ImageBackground>
        </View>
    );

    function saveChapter() {
        // Validate start/end Date
        // Check if start and Enddate are set
        if (!validateCourseDates(startDate, endDate)) {
            return;
        }

        const currContentList = [];
        for (const content of contentList) {
            if (content.id !== undefined) {
                currContentList.push(content.id);
            }
        }

        // Create new Chapter
        if (chapterId == undefined) {
            const myNewChapter: IChapter = {
                title: chapterName,
                startDate: startDate,
                endDate: endDate,
                courseId: course.id,
                contents: currContentList,
            };
            courseService.createNewChapter(myNewChapter, course).then((chapter) => {
                navigation.navigate("CHAPTER", { chapterId: chapter.id });
            });
        } else {
            // Update an existing chapter
            chapter.title = chapterName;
            chapter.startDate = startDate;
            chapter.endDate = endDate;

            chapter.contents = currContentList;

            const patchRequest: RequestInit = RequestFactory.createPatchRequest(chapter);
            chapterEndpoint.patchChapter(patchRequest);
        }
    }

    /**
     * Reorder the video objects in the content list, to save them in the correct order
     *
     * @param from
     * @param to
     */
    function reorderContent(to: number, from: number) {
        contentList.splice(to, 0, contentList.splice(from, 1)[0]);
    }

    /**
     * Method gets all videos belonging to specified course ID.
     *
     * @param courseId ID of the course to which the videos belong.
     */
    async function getAllVideos(courseId?: string): Promise<IVideo[]> {
        const request: RequestInit = RequestFactory.createGetRequest();
        const response: Promise<IVideo[]> = endpointsVideo.getAllVideos(request, courseId);

        return new Promise((resolve) => {
            response
                .then((videosReceived: IVideo[]) => {
                    setVideoPoolList(videosReceived);
                    resolve(videosReceived);
                })
                .catch((error) => {
                    loggerService.error("An error has occured while getting videos.", error);
                })
                .finally(() => {
                    setLoading(false);
                });
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
        padding: "2%",
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
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 5,
        textAlign: "center",
        justifyContent: "center",
    },
    infoText: {
        color: "white",
        fontSize: 20,
        margin: 10,
    },
    list: {
        height: 1, // Actual value is unimportant, this just makes the video list permanently scrollable, disregarding the current view height.
        width: "100%",
    },
    listItemTitle: {
        color: "white",
        fontWeight: "bold",
    },
    listItemSubtitle: {
        color: "white",
    },
});
