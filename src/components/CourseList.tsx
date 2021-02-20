import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { dark } from "../constants/themes/dark";
import { courseList } from "../constants/fixtures/courseList.fixture";
import { ICourse } from "../types/ICourse";
import { getDateIsoString } from "../helperScripts/validateCourseDates";

export const CourseList: React.FC = () => {
    const testCourse: ICourse = courseList[0];
    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{testCourse.name}</Text>
            <Text style={styles.cardContent}>Lecturer: {testCourse.ownership}</Text>
            <Text style={styles.cardContent}>
                Start Date: {getDateIsoString(testCourse.startDate)} End Date: {getDateIsoString(testCourse.endDate)}
            </Text>
            <Text style={styles.cardContent}>Publish State: {testCourse.publishState}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: dark.theme.darkBlue3,
        shadowRadius: 10,
        shadowColor: dark.theme.darkBlue4,
        shadowOffset: { width: -1, height: 1 },
        width: 500,
    },
    cardHeader: {
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        fontSize: 20,
        color: "white",
        textAlignVertical: "center",
        justifyContent: "center",
    },
    cardContent: {
        fontSize: 15,
        color: "white",
        textAlignVertical: "center",
        justifyContent: "center",
    },
});
