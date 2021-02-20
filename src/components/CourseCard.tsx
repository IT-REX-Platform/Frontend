import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { dateConverter } from "../helperScripts/validateCourseDates";

interface CourseCardProps {
    course: ICourse;
}

// eslint-disable-next-line complexity
export const CourseCard: React.FC<CourseCardProps> = (props) => {
    const { course } = props;

    function getPublishedSate(isPublished: string | undefined) {
        console.log(isPublished);
        if (isPublished === "UNPUBLISHED") {
            return (
                <View style={styles.unpublishedCard}>
                    <View style={styles.circleUnpublished} />
                    <Text style={styles.textUnpublished}>unpublished</Text>
                </View>
            );
        } else if (isPublished === "PUBLISHED") {
            return (
                <View style={styles.publishedCard}>
                    <View style={styles.circlePublished} />
                    <Text style={styles.textPublished}>published</Text>
                </View>
            );
        }

        return;
    }

    // eslint-disable-next-line complexity
    function getCourseOwner(owner: Array<string> | undefined) {
        let lecturerString = "";
        if (owner === undefined) {
            return;
        }
        if (owner.length > 1) {
            for (let i = 0; i < owner?.length; i++) {
                if (i < owner?.length - 1) {
                    lecturerString = lecturerString + owner[i] + ", ";
                } else {
                    lecturerString = lecturerString + owner[i];
                }
            }
        } else {
            lecturerString = owner[0];
        }

        return lecturerString;
    }

    return (
        <View style={styles.card}>
            {getPublishedSate(course.publishState)}
            <Text style={styles.cardHeader}>{course.name}</Text>
            <Text style={styles.cardContent}>Lecturer: {getCourseOwner(course.ownership)}</Text>

            <Text style={styles.cardContent}>
                {dateConverter(course.startDate) === "" ? "" : "Start Date: " + dateConverter(course.startDate)}
            </Text>
            <Text style={styles.cardContent}>
                {dateConverter(course.endDate) === "" ? "" : "End Date: " + dateConverter(course.endDate)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: dark.theme.darkBlue3,
        shadowRadius: 10,
        shadowColor: dark.theme.darkBlue4,
        shadowOffset: { width: -1, height: 1 },
        margin: 5,
        maxWidth: 400,
        minWidth: 400,
    },
    cardHeader: {
        margin: 5,
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
        marginLeft: 5,
        marginBottom: 5,
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
        width: 80,
        height: 15,
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
        width: 80,
        height: 15,
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
});
