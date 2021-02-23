import React from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity } from "react-native";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { dateConverter } from "../helperScripts/validateCourseDates";
import { Alert } from "react-native";
import { createAlert } from "../helperScripts/createAlert";

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

    function getDate(showDate: Date | undefined, title: string) {
        return (
            <Text style={styles.cardContent}>
                <Text style={{ fontWeight: "bold" }}>{title}</Text> {dateConverter(showDate)}
            </Text>
        );
    }

    function getAlert() {
        console.log("open Details Page  ");
    }

    return (
        <TouchableOpacity style={styles.card} onPress={getAlert} activeOpacity={0.7}>
            <ImageBackground source={require("../constants/images/Background1-1.png")} style={styles.image}>
                {getPublishedSate(course.publishState)}
                <Text style={styles.cardHeader}>{course.name}</Text>
                <View style={styles.break} />
                <Text style={styles.cardContent}>
                    <Text style={{ fontWeight: "bold" }}>Lecturer:</Text> {getCourseOwner(course.ownership)}
                </Text>

                {dateConverter(course.startDate) === "" ? "" : getDate(course.startDate, "Start Date: ")}

                {dateConverter(course.endDate) === "" ? "" : getDate(course.startDate, "End Date: ")}
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: dark.theme.lightBlue,
        shadowRadius: 10,
        shadowColor: dark.theme.darkBlue1,
        shadowOffset: { width: -1, height: 1 },
        margin: 5,
        maxWidth: 400,
        minWidth: 400,
    },
    cardHeader: {
        flex: 1,
        margin: 5,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    cardContent: {
        fontSize: 15,
        color: "white",
        textAlignVertical: "center",
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
        marginLeft: 315,
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
        width: 80,
        height: 15,
        marginLeft: 315,
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
        backgroundColor: dark.theme.darkBlue4,
        height: 1,
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    touchableStyle: {
        color: dark.theme.pink,
    },
});
