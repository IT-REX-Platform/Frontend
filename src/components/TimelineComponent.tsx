/* eslint-disable complexity */

import React from "react";
import i18n from "../locales";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dark } from "../constants/themes/dark";
import { IChapter } from "../types/IChapter";
import { MaterialIcons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigation } from "@react-navigation/native";
import { ITimePeriod, TimePeriodPublishState } from "../types/ITimePeriod";
import { ChapterComponent } from "./ChapterComponent";
import { ICourse } from "../types/ICourse";

interface TimelineComponentProps {
    isLast?: boolean;
    timePeriod?: ITimePeriod;
    edit: boolean;
    course: ICourse;
}

export const TimelineComponent: React.FC<TimelineComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    return (
        <>
            <View style={styles.circleContainer}>
                <Text style={styles.periodText}>
                    {props.timePeriod?.startDate}-{props.timePeriod?.endDate}
                </Text>
                <View
                    style={[
                        styles.mainCircle,
                        props.timePeriod?.publishState === TimePeriodPublishState.PUBLISHED
                            ? styles.mainCirclePublished
                            : {},
                        props.timePeriod?.publishState === TimePeriodPublishState.UNPUBLISHED
                            ? styles.mainCircleNotPublished
                            : {},
                        props.timePeriod?.publishState === TimePeriodPublishState.NOTSTARTED
                            ? styles.mainCircleNotStarted
                            : {},
                        props.timePeriod?.publishState === undefined ? styles.mainCircleNotStarted : {},
                    ]}>
                    <View
                        style={[
                            styles.innerCircle,
                            props.timePeriod?.publishState === TimePeriodPublishState.PUBLISHED
                                ? styles.innerCirclePublished
                                : {},
                            props.timePeriod?.publishState === TimePeriodPublishState.UNPUBLISHED
                                ? styles.innerCircleNotPublished
                                : {},
                            props.timePeriod?.publishState === TimePeriodPublishState.NOTSTARTED
                                ? styles.innerCircleNotStarted
                                : {},
                            props.timePeriod?.publishState === undefined ? styles.innerCircleNotStarted : {},
                        ]}></View>
                </View>
            </View>
            {props.timePeriod?.chapters !== undefined &&
                props.timePeriod?.chapters.map((chapter) => (
                    <ChapterComponent
                        key={chapter.id}
                        chapter={chapter}
                        editMode={props.edit}
                        course={props.course}></ChapterComponent>
                ))}
            {props.edit && (
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
            <View style={styles.verticalLine}></View>
        </>
    );
};

const styles = StyleSheet.create({
    circleContainer: {
        alignItems: "center",
    },
    periodText: {
        color: "white",
    },
    mainCircle: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    innerCircle: {
        margin: 12.5,
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
    },
    verticalLine: {
        height: 50,
        backgroundColor: "#465371",
        width: 5,
    },
    // Published-Styles
    mainCirclePublished: {
        backgroundColor: "#769575",
    },
    innerCirclePublished: {
        backgroundColor: "#B6EF93",
    },
    // Not published
    mainCircleNotPublished: {
        backgroundColor: "#769575",
    },
    innerCircleNotPublished: {
        backgroundColor: "#707070",
    },
    // Not started yet
    mainCircleNotStarted: {
        backgroundColor: "#3C495B",
    },
    innerCircleNotStarted: {
        backgroundColor: "#707070",
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
    txtAddChapter: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
