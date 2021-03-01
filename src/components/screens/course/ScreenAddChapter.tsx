import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

import React, { ChangeEvent, useState } from "react";
import i18n from "../../../locales";
import { Header } from "../../../constants/navigators/Header";
import { dark } from "../../../constants/themes/dark";
import { CourseContext, LocalizationContext } from "../../Context";
import { DatePickerComponent } from "../../DatePickerComponent";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Draggable from "react-native-draggable";
import * as VideoThumbnails from "expo-video-thumbnails";
import { CompositeNavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { CourseStackParamList, RootDrawerParamList } from "../../../constants/navigators/NavigationRoutes";
import { IChapter } from "../../../types/IChapter";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../../api/endpoints/EndpointsChapter";
import { ICourse } from "../../../types/ICourse";
import { Button } from "react-native-elements";
import CourseService from "../../../services/CourseService";

type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "CHAPTER">,
    DrawerNavigationProp<RootDrawerParamList>
>;

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CHAPTER">;
type ScreenCourseTabsProps = StackScreenProps<CourseStackParamList, "CHAPTER">;

export const ScreenAddChapter: React.FC = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();
    let chapterId = route.params.chapterId;
    if (chapterId == "undefined") {
        chapterId = undefined;
    }
    // Start- and Enddate for a chapter
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    //const [image, setImage] = useState(null);

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

    const course: ICourse = React.useContext(CourseContext);

    const initialCourseName = chapterId == undefined ? "Mein neues Kapitel" : "";
    const chapterEndpoint = new EndpointsChapter();
    const courseService = new CourseService();
    const [chapter, setChapter] = useState<IChapter>({} as IChapter);

    const [chapterName, setChapterName] = useState<string | undefined>(initialCourseName);

    // Use the whole structure from the context ??
    useFocusEffect(
        React.useCallback(() => {
            if (chapterId != undefined) {
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
            <View style={[styles.headContainer]}>
                <View style={styles.borderContainer}>
                    {/*<TextInput label="name" value={courseName} onChangeText={(text) => setCourseName(text)}></TextInput>*/}
                    <TextInput
                        style={styles.courseHeader}
                        value={chapterName}
                        onChangeText={(text) => setChapterName(text)}></TextInput>
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.lightGreen} style={styles.icon} />
                </View>
                <View style={styles.publishContainer}>
                    <Text>Here Publish Button</Text>
                </View>
            </View>
            <Button
                icon={<MaterialIcons name="save-alt" size={28} color="white" style={styles.icon} />}
                title="Save"
                onPress={() => {
                    // Create new Chapter
                    if (chapterId == undefined) {
                        const myNewChapter: IChapter = {
                            title: chapterName,
                            startDate: startDate,
                            endDate: endDate,
                            courseId: course.id,
                        };
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
                }}></Button>
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
                    <Text style={styles.videoPool}>Drag Items Here</Text>
                </View>
                <View style={styles.videoPool}>
                    <Text style={styles.courseHeader}>Choose from Video Pool:</Text>
                    <View style={styles.videoItem}>
                        <View style={styles.thumbnail}></View>
                        <Text>Automata and TM</Text>
                    </View>
                    <View style={styles.videoItem}>
                        <View style={styles.thumbnail}></View>
                        <Text>Automata and TM</Text>
                    </View>
                    <View style={styles.videoItem}>
                        <View style={styles.thumbnail}></View>
                        <Text>Automata and TM</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    publishContainer: {},
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
    videoPool: {
        flex: 2,
        alignItems: "flex-start",
        color: "white",
        fontSize: 24,
    },
    videoItem: {
        borderBottomColor: "rgba(1,43,86,0.5)",
        borderBottomWidth: 2,
        marginBottom: "3%",
    },
    thumbnail: {
        backgroundColor: "white",
        height: 120,
        width: 200,
        marginBottom: "3%",
    },
    courseHeader: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },
    textSytle: {
        color: "white",
    },
});
