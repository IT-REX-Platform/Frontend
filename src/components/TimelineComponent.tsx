/* eslint-disable complexity */

import React from "react";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, View } from "react-native";
import { dark } from "../constants/themes/dark";
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

    const startDate = props.timePeriod?.startDate ? props.timePeriod?.startDate : new Date();
    const endDate = props.timePeriod?.endDate ? props.timePeriod?.endDate : new Date();
    const currentDate = new Date();

    return (
        <>
            <View style={styles.circleContainer}>
                <Text style={styles.periodText}>{props.timePeriod?.fullName}</Text>
                <View
                    style={[
                        styles.mainCircle,
                        // Due TimePeriod
                        currentDate > endDate ? styles.mainCircleDue : {},
                        // Current TimePeriod
                        currentDate > startDate && currentDate < endDate ? styles.mainCircleCurrent : {},
                        // Upcomming TimePeriod
                        currentDate < startDate ? styles.mainCircleUpcomming : {},
                    ]}>
                    <View
                        style={[
                            styles.innerCircle,
                            currentDate > endDate ? styles.innerCircleDue : {},
                            currentDate > startDate && currentDate < endDate ? styles.innerCircleCurrent : {},
                            currentDate < startDate ? styles.innerCircleUpcomming : {},
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
        alignSelf: "center",
    },
    // Published-Styles
    mainCircleDue: {
        backgroundColor: "#769575",
    },
    innerCircleDue: {
        backgroundColor: "#B6EF93",
    },
    // Not published
    mainCircleCurrent: {
        backgroundColor: "#769575",
    },
    innerCircleCurrent: {
        backgroundColor: "#707070",
    },
    // Not started yet
    mainCircleUpcomming: {
        backgroundColor: "#3C495B",
    },
    innerCircleUpcomming: {
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
