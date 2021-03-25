/* eslint-disable complexity */
import React, { useEffect } from "react";
import { useState } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import { CourseRoles } from "../constants/CourseRoles";
import { dateConverter } from "../helperScripts/validateCourseDates";
import i18n from "../locales";
import AuthenticationService from "../services/AuthenticationService";
import { IUser } from "../types/IUser";
import { LocalizationContext, CourseContext } from "./Context";

interface DataTableProps {
    onDescriptionChanged: (description: string | undefined) => void;
}

export const CourseInformationTable: React.FC<DataTableProps> = (props) => {
    React.useContext(LocalizationContext);
    const { onDescriptionChanged } = props;

    const { course } = React.useContext(CourseContext);
    // User info.
    const [user, setUserInfo] = useState<IUser>({});
    const [description, setDescription] = useState<string | undefined>(course.courseDescription);

    useEffect(() => {
        AuthenticationService.getInstance().getUserInfo(setUserInfo);
    }, [description]);

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
                <Text style={styles.valueStyle}>{userViewDescription()}</Text>
            </View>
        </>
    );

    function userViewDescription() {
        if (user.courses == undefined || course.id == undefined) {
            return <></>;
        }
        const courseRole: CourseRoles = user.courses[course.id];

        if (courseRole === CourseRoles.OWNER || courseRole == CourseRoles.MANAGER) {
            return (
                <TextInput
                    style={[styles.valueStyle, { minHeight: 200 }]}
                    defaultValue={
                        course.courseDescription ? course.courseDescription : i18n.t("itrex.enterCourseDescription")
                    }
                    onChangeText={(text) => {
                        onDescriptionChanged(text);
                    }}
                    multiline={true}
                />
            );
        } else {
            return (
                <Text style={styles.valueStyle}>
                    {course.courseDescription !== null ? course.courseDescription : i18n.t("itrex.noCourseDescription")}
                </Text>
            );
        }
    }
};

const styles = StyleSheet.create({
    titleStyle: {
        width: "30%",
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    valueStyle: {
        width: "100%",
        color: "white",
        flexGrow: 5,
    },
    rowStyle: {
        flexDirection: "row",
        borderBottomColor: "white",
        borderBottomWidth: 1,
        width: "90%",
        padding: "20px",
    },
});
