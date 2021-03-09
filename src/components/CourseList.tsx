import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CourseCard } from "./CourseCard";
import { ICourse } from "../types/ICourse";
import i18n from "./../locales";

interface CourseListProps {
    courses: ICourse[];
}

export const CourseList: React.FC<CourseListProps> = (props) => {
    const { courses } = props;

    return <> {getList(courses)}</>;
};

function getList(courses: ICourse[]) {
    if (courses.length === 0) {
        return (
            <View style={styles.cardView}>
                <Text style={{ color: "white", fontSize: 20, marginTop: 32 }}>{i18n.t("itrex.noCoursesFilter")}</Text>
            </View>
        );
    }
    return (
        <View style={styles.cardView}>
            {courses.map((course: ICourse) => {
                return <CourseCard course={course} />;
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "center",
        margin: 5,
    },
});
