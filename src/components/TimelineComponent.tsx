/* eslint-disable complexity */

import React from "react";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, View } from "react-native";
import { ITimePeriod } from "../types/ITimePeriod";
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
            <View style={styles.verticalLine}></View>
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
        </>
    );
};

const styles = StyleSheet.create({
    circleContainer: {
        alignItems: "center",
    },
    periodText: {
        color: "white",
        marginBottom: 10,
        fontWeight: "bold",
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
        height: 30,
        backgroundColor: "#465371",
        width: 5,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10,
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
});
