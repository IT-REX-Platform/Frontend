import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import i18n from "../../../locales";
import { Header } from "../../../constants/navigators/Header";
import { Text, ImageBackground, StyleSheet, View, TouchableOpacity } from "react-native";
import { dark } from "../../../constants/themes/dark";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../../../constants/navigators/NavigationRoutes";
import { LocalizationContext } from "../../Context";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export type ScreenCourseTimelineNavigationProp = CompositeNavigationProp<
    MaterialTopTabNavigationProp<CourseTabParamList, "TIMELINE">,
    CompositeNavigationProp<StackNavigationProp<CourseStackParamList>, DrawerNavigationProp<RootDrawerParamList>>
>;

export const ScreenCourseTimeline: React.FC = () => {
    const navigation = useNavigation<ScreenCourseTimelineNavigationProp>();

    const [count, setCount] = useState(0);
    const onPress = () => setCount((prevCount) => prevCount + 1);

    React.useContext(LocalizationContext);

    return (
        <>
            <View style={styles.container}>
                <Header title={i18n.t("itrex.home")} />
                <View style={styles.headConatiner}>
                    <Text style={styles.courseHeader}>Theoretische Informatik II</Text>
                    <Text style={styles.chapterHeader}>Placeholder for Menu</Text>
                </View>
                <ImageBackground
                    source={require("../../../constants/images/Background3.png")}
                    style={styles.image}
                    imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "center" }}>
                    <View style={styles.chapterContainer}>
                        <View style={styles.chapterTopRow}>
                            <Text style={styles.chapterHeader}>Ch. 1: Automata and Turing-Machines </Text>
                            <Text style={styles.chapterStatus}>Published </Text>
                        </View>
                        <View style={styles.chapterBottomRow}>
                            <Text style={styles.chapterMaterial}>Preview Chapter Material</Text>
                        </View>
                    </View>

                    <View style={styles.addChapterContainer}>
                        <TouchableOpacity style={styles.btnAdd} onPress={onPress}>
                            <Text style={styles.txtAddChapter}>+ Add Chapter</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 4,
        flexDirection: "column",
        backgroundColor: dark.theme.darkBlue1,
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
        height: "20%",
        width: "80%",
        marginTop: "1%",
        padding: "1.5%",
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
        flex: 4,
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
