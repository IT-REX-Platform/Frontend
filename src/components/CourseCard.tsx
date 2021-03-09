import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { dateConverter } from "../helperScripts/validateCourseDates";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import i18n from "./../locales";
import { CoursePublishState } from "../constants/CoursePublishState";

interface CourseCardProps {
    course: ICourse;
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
    const { course } = props;
    const navigation = useNavigation();

    function getPublishedSate(isPublished: CoursePublishState | undefined) {
        if (isPublished === CoursePublishState.UNPUBLISHED) {
            return (
                <View style={styles.unpublishedCard}>
                    <View style={styles.circleUnpublished} />
                    <Text style={styles.textUnpublished}>{i18n.t("itrex.unpublished")}</Text>
                </View>
            );
        } else if (isPublished === CoursePublishState.PUBLISHED) {
            return (
                <View style={styles.publishedCard}>
                    <View style={styles.circlePublished} />
                    <Text style={styles.textPublished}>{i18n.t("itrex.published")}</Text>
                </View>
            );
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
    unpublishedCard: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderColor: dark.theme.pink,
        borderWidth: 2,
        textShadowColor: dark.theme.pink,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
        marginLeft: 295,
        marginTop: 5,
    },
    textUnpublished: {
        color: dark.theme.pink,
        fontSize: 10,
    },
    circleUnpublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.pink,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.pink,
        marginRight: 3,
    },
    publishedCard: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderColor: dark.theme.lightGreen,
        borderWidth: 2,
        textShadowColor: dark.theme.lightGreen,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
        marginLeft: 295,
        marginTop: 5,
    },
    textPublished: {
        color: dark.theme.lightGreen,
        fontSize: 10,
    },
    circlePublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightGreen,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightGreen,
        marginRight: 5,
    },
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
        marginTop: 1,
    },
});
