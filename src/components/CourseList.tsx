import React from "react";
import { View } from "react-native";
import { courseList } from "../constants/fixtures/courseList.fixture";
import { ICourse } from "../types/ICourse";
import { CourseCard } from "./CourseCard";

export const CourseList: React.FC = () => {
    const testCourse: ICourse = courseList[0];
    return (
        <View>
            <CourseCard course={testCourse} />
        </View>
    );
};
