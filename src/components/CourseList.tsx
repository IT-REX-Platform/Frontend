import React from "react";
import { View, StyleSheet } from "react-native";
import { courseList } from "../constants/fixtures/courseList.fixture";
import { CourseCard } from "./CourseCard";

export const CourseList: React.FC = () => {
    const allCourses = [];

    for (const singleCourse of courseList) {
        allCourses.push(<CourseCard course={singleCourse} />);
    }

    return <View style={styles.cardView}>{allCourses}</View>;
};

const styles = StyleSheet.create({
    cardView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "center",
    },
});
