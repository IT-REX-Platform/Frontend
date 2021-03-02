import { Platform, StyleSheet, Text, View, Image, FlatList, Animated } from "react-native";

import React, { ChangeEvent, useState } from "react";
import i18n from "../../locales";
import { Header } from "../../constants/navigators/Header";
import { dark } from "../../constants/themes/dark";
import { LocalizationContext } from "../Context";
import { DatePickerComponent } from "../DatePickerComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Draggable from "react-native-draggable";
import * as VideoThumbnails from "expo-video-thumbnails";
import { PanGestureHandler, State } from "react-native-gesture-handler";

// Another way for Drag and Drop. Just delete if not needed.
//let dropzoneHeight = 200;
//let itemHeight = 60;

//let FlatItem = ({ item }) => {
//    let translateX = new Animated.Value(0);
//    let translateY = new Animated.Value(0);
//    let onGestureEvent = Animated.event([
//       {
//            nativeEvent: {
//                translationX: translateX,
//                translationY: translateY,
//            },        },]);
//
//    let _lastOffset = { x: 0, y: 0 };
//    let onHandlerStateChange = event => {
//        if (event.nativeEvent.oldState === State.ACTIVE) {
//            _lastOffset.x += event.nativeEvent.translationX;
//            _lastOffset.y += event.nativeEvent.translationY;
//            translateX.setOffset(_lastOffset.x);
//            translateX.setValue(0);
//            translateY.setOffset(_lastOffset.y);
//            translateY.setValue(0);

//TODO: check here if the item is inside of container and if it is do some calculations to relocate it to your container.
//        }
//    };

//    return (
//        <PanGestureHandler
//            onGestureEvent={onGestureEvent}
//            onHandlerStateChange={onHandlerStateChange}>
//            <Animated.View
//                style={[styles.item, { transform: [{ translateX }, { translateY }] }]}>
//                <Text>{item.id}</Text>
//            </Animated.View>
//        </PanGestureHandler>
//    );
//};
//let data = [
//    { key: 1, id: 1 },
//    { key: 2, id: 2 },
//    { key: 3, id: 3 },
//    { key: 4, id: 4 },
//];

// This part is needed in return --> View
// <FlatList
//data={data}
//ListHeaderComponent={() => <View style={styles.dropzone} />}
//renderItem={props => <FlatItem {...props} />}
//style={{ flex: 1 }}
///>

export const ScreenAddChapter: React.FC = () => {
    React.useContext(LocalizationContext);

    // Start- and Enddate for a chapter
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    //const [image, setImage] = useState(null);

    //Data for VideoPool List
    const imageSource = "https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg";

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
            <Header title={i18n.t("itrex.AddChapter")} />
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
                    <FlatList
                        data={[
                            { key: "Video Title 1" },
                            { key: "Video Title 2" },
                            { key: "Video Title 3" },
                            { key: "Video Title 4" },
                            { key: "Video Title 5" },
                            { key: "Video Title 6" },
                            { key: "Video Title 7" },
                            { key: "Video Title 8" },
                            { key: "Video Title 9" },
                            { key: "Video Title 10" },
                        ]}
                        renderItem={({ item }) => (
                            <View>
                                <Text style={styles.courseHeader}>{item.key}</Text>
                                <Image
                                    source={{
                                        uri: imageSource,
                                    }}
                                    style={styles.image}></Image>
                            </View>
                        )}
                    />
                </View>
            </View>
            <View>
                <Text style={styles.courseHeader}>Drag and Drop between two Lists:</Text>
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
        width: 193,
        height: 110,
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },
    textSytle: {
        color: "white",
    },
    dropzone: {},
    item: {},
});
