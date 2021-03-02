import { CompositeNavigationProp, useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TouchableOpacity, Switch } from "react-native";

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

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "TIMELINE">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();
    const courseService: CourseService = new CourseService();

    const [count, setCount] = useState(0);

    const [edit, setEdit] = useState(false);

    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);

    const [myCourse, setMyCourse] = useState<ICourse>({});

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && course.id !== undefined) {
            courseService.getCourse(course.id).then((receivedCourse) => {
                setMyCourse(receivedCourse);
                console.log("Load course again");
            });
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../../constants/images/Background3.png")}
                style={styles.image}
                imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "contain" }}>
                <View style={styles.editMode}>
                    <Text style={styles.editModeText}>Toggle Edit-mode</Text>
                    <Switch
                        value={edit}
                        onValueChange={() => {
                            setEdit(!edit);
                        }}></Switch>
                </View>

                {myCourse.chapterObjects?.map((chapter) => (
                    <ChapterComponent key={chapter.id} chapter={chapter} editMode={edit}></ChapterComponent>
                ))}
                {edit && (
                    <View style={styles.addChapterContainer}>
                        <TouchableOpacity
                            style={styles.btnAdd}
                            onPress={() => {
                                navigation.navigate("CHAPTER", { chapterId: undefined });
                            }}>
                            <Text style={styles.txtAddChapter}>+ Add Chapter</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: "3%",
        flex: 1,
        flexDirection: "column",
        backgroundColor: dark.theme.darkBlue1,
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
    headConatiner: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "3%",
    },
    courseHeader: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
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
    chapterContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        height: "20%",
        width: "80%",
        marginTop: "1%",
        padding: "1.5%",
        borderWidth: 3,
        borderColor: dark.theme.darkGreen,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    chapterTopRow: {
        width: "100%",
        flex: 2,
    },

    chapterBottomRow: {
        width: "100%",
        flex: 1,
        alignItems: "baseline",
    },
    chapterHeader: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    chapterStatus: {
        alignSelf: "flex-end",
        position: "absolute",
        color: "white",
        fontWeight: "bold",
    },
    chapterMaterial: {
        alignSelf: "center",
        color: "white",
        fontWeight: "bold",
    },
    txtAddChapter: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    image: {
        flex: 1,
        width: "screenWidth",
        backgroundColor: dark.theme.darkBlue1,
        alignItems: "center",
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
    icon: {
        width: 100,
        height: 100,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
    },
});
