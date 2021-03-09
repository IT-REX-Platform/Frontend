import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { dateConverter } from "../helperScripts/validateCourseDates";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import i18n from "./../locales";
import { CoursePublishState } from "../constants/CoursePublishState";
import { InfoPublished } from "./uiElements/InfoPublished";
import { InfoUnpublished } from "./uiElements/InfoUnpublished";

interface CourseCardProps {
    course: ICourse;
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
    const { course } = props;
    const navigation = useNavigation();

    function getPublishedSate(isPublished: CoursePublishState | undefined) {
        if (isPublished === CoursePublishState.UNPUBLISHED) {
            return <InfoUnpublished />;
        } else if (isPublished === CoursePublishState.PUBLISHED) {
            return <InfoPublished />;
        }

        return;
    }

    function getDate(showDate: Date | undefined, title: string) {
        if (dateConverter(showDate) === "") {
            return <View style={styles.cardContent} />;
        }
        return (
            <Text style={styles.cardContent}>
                <Text style={{ fontWeight: "bold", marginEnd: 10 }}>{title}</Text>
                {dateConverter(showDate)}
            </Text>
        );
    }

    function navigateToCourse(course: ICourse) {
        navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
            courseId: course.id,
        });
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => navigateToCourse(course)} activeOpacity={0.7}>
            {getPublishedSate(course.publishState)}
            <Text style={styles.cardHeader}>{course.name}</Text>
            <View style={styles.break} />
            {/*<Text style={styles.cardContent}>Lecturer:</Text> {getCourseOwner(course.ownership)}*/}

            {getDate(course.startDate, i18n.t("itrex.startDate"))}
            {getDate(course.endDate, i18n.t("itrex.endDate"))}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowRadius: 10,
        shadowOffset: { width: -1, height: 1 },
        margin: 8,
        width: 400,
        backgroundColor: dark.Opacity.grey,
    },
    cardHeader: {
        margin: 8,
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    cardContent: {
        fontSize: 15,
        color: "white",
        textAlignVertical: "center",
        margin: 4,
        marginLeft: 32,
        minHeight: 20,
    },
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
        marginTop: 1,
    },
});
