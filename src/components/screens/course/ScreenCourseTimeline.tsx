/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TouchableOpacity, Switch } from "react-native";
import { CompositeNavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import { dark } from "../../../constants/themes/dark";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { CourseContext, LocalizationContext } from "../../Context";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ChapterComponent } from "../../ChapterComponent";
import { ICourse } from "../../../types/ICourse";
import CourseService from "../../../services/CourseService";
import AuthenticationService from "../../../services/AuthenticationService";
import i18n from "../../../locales";
import { TimelineComponent } from "../../TimelineComponent";
import { CoursePublishState } from "../../../constants/CoursePublishState";
import { TimePeriodPublishState } from "../../../types/ITimePeriod";
import { ScrollView } from "react-native-gesture-handler";
import { EndpointsCourse } from "../../../api/endpoints/EndpointsCourse";
import { EndpointsChapter } from "../../../api/endpoints/EndpointsChapter";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { IChapter } from "../../../types/IChapter";

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "TIMELINE">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();
    const courseService: CourseService = new CourseService();

    const courseEndpoint = new EndpointsCourse();
    const chapterEndpoint = new EndpointsChapter();

    const [edit, setEdit] = useState(false);

    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);

    const [myCourse, setMyCourse] = useState<ICourse>({});

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && course.id !== undefined) {
            //setMyCourse(fakeData);

            //courseService.getCourse(course.id).then((receivedCourse) => setMyCourse(receivedCourse));
            const request: RequestInit = RequestFactory.createGetRequest();
            courseEndpoint.getCourse(request, course.id).then((receivedCourse) => {
                setMyCourse(receivedCourse);
                if (receivedCourse.chapters !== undefined) {
                    for (const chapter of receivedCourse.chapters) {
                        if (chapter.contentReferences !== undefined) {
                            for (const contentRef of chapter.contentReferences) {
                                const timePeriod = receivedCourse.timePeriods?.find(
                                    (period) => period.id === contentRef.timePeriodId
                                );
                                if (timePeriod !== undefined) {
                                    if (timePeriod?.chapters === undefined) {
                                        timePeriod.chapters = [];
                                    }

                                    // Search for chapter in timePeriod
                                    let foundChapter = timePeriod.chapters.find(
                                        (tmpChapter) => tmpChapter === chapter.id
                                    );

                                    if (foundChapter === undefined) {
                                        foundChapter = {
                                            courseId: chapter.courseId,
                                            id: chapter.id,
                                            name: chapter.name,
                                        };
                                        foundChapter.contentReferences = [];
                                        timePeriod.chapters.push(foundChapter);
                                    }

                                    foundChapter?.contentReferences?.push(contentRef);
                                }
                            }
                        }
                    }
                    console.log(receivedCourse);
                }
            });
        }
    }, [isFocused]);

    return (
        <ImageBackground
            source={require("../../../constants/images/Background3.png")}
            style={styles.imageContainer}
            imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "contain" }}>
            {lecturerEditMode()}

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {myCourse.chapters?.length === 0 ? (
                    <View>{!edit && <Text style={styles.textStyle}>{i18n.t("itrex.noChapters")}</Text>}</View>
                ) : (
                    myCourse.chapters?.map((chapter) => (
                        <ChapterComponent
                            key={chapter.id}
                            editMode={edit}
                            chapter={chapter}
                            course={course}></ChapterComponent>
                    ))
                )}
                {/*myCourse.timePeriods?.length === 0 ? (
                    <View>{!edit && <Text style={styles.textStyle}>{i18n.t("itrex.noChapters")}</Text>}</View>
                ) : (
                    myCourse.timePeriods?.map((timePeriod) => (
                        <TimelineComponent key={timePeriod.id} edit={edit} timePeriod={timePeriod}></TimelineComponent>
                    ))
                    )*/}
                {edit && (
                    <View style={styles.addChapterContainer}>
                        <TouchableOpacity
                            style={styles.btnAdd}
                            onPress={() => {
                                navigation.navigate("CHAPTER", { chapterId: undefined });
                            }}>
                            <Text style={styles.txtAddChapter}>{i18n.t("itrex.addChapter")}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );

    // eslint-disable-next-line complexity
    function lecturerEditMode() {
        if (AuthenticationService.getInstance().isLecturerOrAdmin()) {
            return (
                <>
                    <View style={styles.editMode}>
                        <Text style={styles.editModeText}>{i18n.t("itrex.editMode")}</Text>
                        <Switch
                            value={edit}
                            onValueChange={() => {
                                setEdit(!edit);
                            }}></Switch>
                    </View>
                </>
            );
        }
    }
};

const fakeData: ICourse = {
    id: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
    name: "Forschungsprojekt",
    startDate: new Date("2021-02-23T00:00:00.000Z"),
    endDate: new Date("2021-08-23T00:00:00.000Z"),
    maxFoodSum: 1000,
    courseDescription: "",
    publishState: CoursePublishState.PUBLISHED,
    chapters: ["31a763c9-f765-41be-b16d-51b2118be5be", "1b00bd0e-e43c-4cf2-be03-950e7ffa0c85"],
    timePeriodObjects: [
        {
            id: "0001",
            title: "Woche 1",
            chapterObjects: [
                {
                    id: "31a763c9-f765-41be-b16d-51b2118be5be",
                    title: "01: Einführung",
                    courseId: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
                    startDate: new Date("2021-03-08T00:00:00.000Z"),
                    endDate: new Date("2021-03-14T00:00:00.000Z"),
                    contents: [],
                },
                {
                    id: "1b00bd0e-e43c-4cf2-be03-950e7ffa0c85",
                    title: "02: Einführung Part 2",
                    courseId: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
                    startDate: new Date("2021-03-15T00:00:00.000Z"),
                    endDate: new Date("2021-03-21T00:00:00.000Z"),
                    contents: ["27c06535-4491-4312-b0ed-c22381fb04fb", "bb725bf5-514f-4eda-8f04-65e95ab03dab"],
                },
            ],
            publishState: TimePeriodPublishState.PUBLISHED,
        },
        {
            id: "0002",
            title: "Woche 2",
            chapterObjects: [
                {
                    id: "31a763c9-f765-41be-b16d-51b2118be5be",
                    title: "03: Weiterführung von letzter Woche",
                    courseId: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
                    startDate: new Date("2021-03-08T00:00:00.000Z"),
                    endDate: new Date("2021-03-14T00:00:00.000Z"),
                    contents: [],
                },
                {
                    id: "1b00bd0e-e43c-4cf2-be03-950e7ffa0c85",
                    title: "04: Noch eine Ergänzung",
                    courseId: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
                    startDate: new Date("2021-03-15T00:00:00.000Z"),
                    endDate: new Date("2021-03-21T00:00:00.000Z"),
                    contents: ["27c06535-4491-4312-b0ed-c22381fb04fb", "bb725bf5-514f-4eda-8f04-65e95ab03dab"],
                },
            ],
            publishState: TimePeriodPublishState.UNPUBLISHED,
        },
        {
            id: "0003",
            title: "Woche 3",
            publishState: TimePeriodPublishState.NOTSTARTED,
        },
        {
            id: "0004",
            title: "Woche 4",
            publishState: TimePeriodPublishState.NOTSTARTED,
        },
        {
            id: "0005",
            title: "Woche 5",
            publishState: TimePeriodPublishState.NOTSTARTED,
        },
    ],
    chapterObjects: [
        {
            id: "31a763c9-f765-41be-b16d-51b2118be5be",
            title: "01: Einführung",
            courseId: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
            startDate: new Date("2021-03-08T00:00:00.000Z"),
            endDate: new Date("2021-03-14T00:00:00.000Z"),
            contents: [],
        },
        {
            id: "1b00bd0e-e43c-4cf2-be03-950e7ffa0c85",
            title: "02: Bla Bla Blaa",
            courseId: "ca8955ca-a849-497a-8583-2e3bcaf45ba1",
            startDate: new Date("2021-03-15T00:00:00.000Z"),
            endDate: new Date("2021-03-21T00:00:00.000Z"),
            contents: ["27c06535-4491-4312-b0ed-c22381fb04fb", "bb725bf5-514f-4eda-8f04-65e95ab03dab"],
        },
    ],
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        paddingTop: "3%",
        backgroundColor: dark.theme.darkBlue1,
    },
    scrollContainer: {
        width: "screenWidth",
        alignItems: "center",
        paddingBottom: 20,
    },
    editMode: {
        alignSelf: "flex-end",
        flexDirection: "row",
        paddingRight: "20px",
        paddingTop: "20px",
    },
    editModeText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        paddingRight: "20px",
    },
    addChapterContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        height: "100px",
        width: "80%",
        marginTop: "1%",
        padding: "0.5%",
        borderWidth: 3,
        borderColor: dark.theme.lightBlue,
    },
    txtAddChapter: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    btnAdd: {
        width: "100%",
        height: "100%",
        borderWidth: 2,
        borderColor: "rgba(79,175,165,1.0)",
        borderRadius: 25,
        borderStyle: "dotted",
        alignItems: "center",
        justifyContent: "center",
    },
    textStyle: {
        margin: 10,
        color: "white",
        fontWeight: "bold",
    },
});
