import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { getDateIsoString } from "../helperScripts/validateCourseDates";

interface CourseCardProps {
    course: ICourse;
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
    const { course } = props;
    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{course.name}</Text>
            <Text style={styles.cardContent}>Lecturer: {course.ownership}</Text>
            <Text style={styles.cardContent}>
                Start Date: {getDateIsoString(course.startDate)} End Date: {getDateIsoString(course.endDate)}
            </Text>
            <Text style={styles.cardContent}>Publish State: {course.publishState}</Text>
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
