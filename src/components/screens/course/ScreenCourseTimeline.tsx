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
import { ScrollView } from "react-native-gesture-handler";

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "TIMELINE">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();
    const courseService: CourseService = new CourseService();

    const [edit, setEdit] = useState(false);

    React.useContext(LocalizationContext);

    const course: ICourse = React.useContext(CourseContext);

    const [myCourse, setMyCourse] = useState<ICourse>({});

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && course.id !== undefined) {
            courseService.getCourse(course.id).then((receivedCourse) => setMyCourse(receivedCourse));
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
                    myCourse.chapterObjects?.map((chapter) => (
                        <ChapterComponent
                            key={chapter.id}
                            chapter={chapter}
                            editMode={edit}
                            courseId={course.id}></ChapterComponent>
                    ))
                )}

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
