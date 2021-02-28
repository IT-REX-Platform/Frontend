import { Platform, StyleSheet, Text, View } from "react-native";

import React, { ChangeEvent, useState } from "react";
import i18n from "../../../locales";
import { Header } from "../../../constants/navigators/Header";
import { dark } from "../../../constants/themes/dark";
import { LocalizationContext } from "../../Context";
import { DatePickerComponent } from "../../DatePickerComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Draggable from "react-native-draggable";
import * as VideoThumbnails from "expo-video-thumbnails";

export const ScreenAddChapter: React.FC = () => {
    React.useContext(LocalizationContext);

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

    return (
        <View style={styles.container}>
            <Header title={i18n.t("itrex.Add Chapter")} />
            <View style={[styles.headContainer]}>
                <View style={styles.borderContainer}>
                    <Text style={styles.courseHeader}>Ch. 1: Chapter Name</Text>
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.lightGreen} style={styles.icon} />
                </View>
                <View style={styles.publishContainer}>
                    <Text>Here Publish Button</Text>
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
                        onDateChanged={startDateChanged}></DatePickerComponent>
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
