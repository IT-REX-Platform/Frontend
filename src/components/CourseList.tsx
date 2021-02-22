import React from "react";
import { View, StyleSheet } from "react-native";
import { CourseCard } from "./CourseCard";
import { ICourse } from "../types/ICourse";

interface CourseListProps {
    courses: ICourse[];
}

export const CourseList: React.FC<CourseListProps> = (props) => {
    const { courses } = props;

    return (
        <>
            <View style={styles.cardView}>
                {courses.map((course) => {
                    return <CourseCard course={course} />;
                })}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    cardView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "center",
    },
});
