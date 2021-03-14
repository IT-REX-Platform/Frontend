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
import { dateConverter, validateCourseDates } from "../../../helperScripts/validateCourseDates";
import { IContent } from "../../../types/IContent";
import { EndpointsContentReference } from "../../../api/endpoints/EndpointsContentReference";
import Select from "react-select";

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
    //const [image, setImage] = useState(null);

    // Loading icon state.
    const [isLoading, setLoading] = useState(true);

    const course: ICourse = React.useContext(CourseContext);

    const initialCourseName = chapterId == undefined ? i18n.t("itrex.myNewChapter") : "";
    const chapterEndpoint = new EndpointsChapter();
    const contentReferenceEndpoint = new EndpointsContentReference();
    const courseService = new CourseService();
    const [chapter, setChapter] = useState<IChapter>({} as IChapter);

    const [chapterName, setChapterName] = useState<string | undefined>(initialCourseName);

    const [contentList, setContentList] = useState<IContent[]>([]);

    const [videoPoolList, setVideoPoolList] = useState<IVideo[]>([]);

    const timePeriods = course.timePeriods?.map((timePeriod, idx) => {
        return {
            value: timePeriod.id,
            label:
                "Week " +
                (idx + 1) +
                " (" +
                dateConverter(timePeriod.startDate) +
                " - " +
                dateConverter(timePeriod.endDate) +
                ")",
        };
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
    const listRemoveItem = ({ item, drag }: { item: IContent; drag: undefined }) => (
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
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                {item.video?.title}
                                {timePeriods !== undefined && (
                                    <Select
                                        options={timePeriods}
                                        defaultValue={timePeriods.find(
                                            (timePeriod) => timePeriod.value === item.timePeriodId
                                        )}
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 5,
                                            colors: {
                                                ...theme.colors,
                                                primary25: dark.Opacity.darkBlue1,
                                                primary: dark.Opacity.pink,
                                                backgroundColor: dark.Opacity.darkBlue1,
                                            },
                                        })}
                                        menuPortalTarget={document.body}
                                        menuPosition={"fixed"}
                                        styles={{
                                            container: () => ({
                                                width: 300,
                                            }),
                                        }}></Select>
                                )}
                            </View>
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.listItemSubtitle}>
                            {calculateVideoSize(item.video?.length)}
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

        // Create new ContentReference
        const contentRef: IContent = {
            chapterId: chapterId,
            contentId: video.id,
            video: video,
        };
        setContentList([...contentList, contentRef]);
    }

    /**
     * Remove Video from Chapter List
     * @param video
     */
    function removeContent(content: IContent) {
        const index = contentList.indexOf(content);
        if (index > -1) {
            contentList.splice(index, 1);
        }
        setContentList([...contentList]);
        if (content.video !== undefined) {
            setVideoPoolList([...videoPoolList, content.video]);
        }
    }

    // Use the whole structure from the context ??
    useFocusEffect(
        React.useCallback(() => {
            if (chapterId != undefined) {
                loggerService.trace("Getting all videos of course: " + course.id);

                const request: RequestInit = RequestFactory.createGetRequest();
                chapterEndpoint
                    .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
                    .then((chapter) => {
                        setChapter(chapter);
                        setChapterName(chapter.name);
                        loggerService.trace("Chater name: " + chapterName);

                        _getAllVideos(course.id).then((videos) => {
                            // Are there already contents in this chapter ?
                            if (chapter.contentReferences !== undefined) {
                                const newContentList: IVideo[] = [];
                                // Remove assigned contents from the pool, and add those to the "contentList"
                                for (const contentReference of chapter.contentReferences) {
                                    const videoInPool = videos.findIndex(
                                        (video) => video.id === contentReference.contentId
                                    );

                                    if (videoInPool !== -1) {
                                        // Add To Content-List
                                        // Create new ContentReference
                                        const contentRef: IContent = {
                                            chapterId: chapterId,
                                            contentId: videos[videoInPool].id,
                                            video: videos[videoInPool],
                                        };
                                        newContentList.push(contentRef);
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
                _getAllVideos(course.id);
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

                <View style={styles.headContainer}></View>

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

        const currContentList = [];
        for (const content of contentList) {
            if (content.id !== undefined) {
                currContentList.push(content.id);
            }
        }

        // Create new Chapter
        if (chapterId == undefined) {
            const myNewChapter: IChapter = {
                name: chapterName,
                courseId: course.id,
            };

            const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(myNewChapter);

            chapterEndpoint.createChapter(postRequest).then((chapter) => {
                // Assign the Videos
                Promise.all(
                    contentList.map((content) => {
                        content.chapterId = chapter.id;
                        const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(content);
                        return new Promise((resolve) => {
                            contentReferenceEndpoint.createContentReference(postRequest).then((contentRef) => {
                                resolve(contentRef);
                            });
                        });
                    })
                ).then(() => {
                    // Navigate to the new Chapter
                    navigation.navigate("CHAPTER", { chapterId: chapter.id }); // Navigate to the new Chapter
                });
            });
        } else {
            // Update an existing chapter
            chapter.name = chapterName;

            //How to reorder the contents ?

            const patchRequest: RequestInit = RequestFactory.createPatchRequest(chapter);
            chapterEndpoint.patchChapter(
                patchRequest,
                i18n.t("itrex.chapterUpdateSuccess"),
                i18n.t("itrex.updateChapterError")
            );
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
    async function _getAllVideos(courseId?: string): Promise<IVideo[]> {
        if (course.id == undefined) {
            loggerService.warn("Course ID undefined, can't get videos.");
            setLoading(false);
            return [];
        }
        loggerService.trace("Getting all videos of course: " + course.id);

        const request: RequestInit = RequestFactory.createGetRequest();
        return endpointsVideo
            .getAllVideos(request, courseId, undefined, i18n.t("itrex.getVideosError"))
            .then((videosReceived: IVideo[]) => {
                setVideoPoolList(videosReceived);
                return videosReceived;
            })
            .finally(() => setLoading(false));
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
