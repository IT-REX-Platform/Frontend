import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { dateConverter } from "../helperScripts/validateCourseDates";
import i18n from "../locales";
import { LocalizationContext, CourseContext } from "./Context";

export const CourseInformationTable: React.FC = () => {
    React.useContext(LocalizationContext);
    const { course } = React.useContext(CourseContext);

    return (
        <>
            <View style={styles.rowStyle}>
                <Text style={styles.titleStyle}>{i18n.t("itrex.startDate")}</Text>
                <Text style={styles.valueStyle}>{dateConverter(course.startDate)}</Text>
            </View>
            <View style={styles.rowStyle}>
                <Text style={styles.titleStyle}>{i18n.t("itrex.endDate")}</Text>
                <Text style={styles.valueStyle}>{dateConverter(course.endDate)}</Text>
            </View>
            <View style={styles.rowStyle}>
                <Text style={styles.titleStyle}>{i18n.t("itrex.courseDescription")} </Text>
                <Text style={styles.valueStyle}>{course.courseDescription}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    titleStyle: {
        width: "30%",
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    valueStyle: {
        width: "70%",
        color: "white",
    },
    rowStyle: {
        flexDirection: "row",
        borderBottomColor: "white",
        borderBottomWidth: 1,
        width: "90%",
        padding: "20px",
    },
});
