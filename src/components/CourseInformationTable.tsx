import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { CompositeNavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import { loggerFactory } from "../../logger/LoggerConfig";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { RequestFactory } from "../api/requests/RequestFactory";
import { CoursePublishState } from "../constants/CoursePublishState";
import { CourseRoles } from "../constants/CourseRoles";
import { dark } from "../constants/themes/dark";
import { dateConverter } from "../helperScripts/validateCourseDates";
import i18n from "../locales";
import AuthenticationService from "../services/AuthenticationService";
import { ICourse } from "../types/ICourse";
import { IUser } from "../types/IUser";
import { LocalizationContext, CourseContext } from "./Context";
import { TextButton } from "./uiElements/TextButton";

export const CourseInformationTable: React.FC = () => {
    React.useContext(LocalizationContext);
    const { course } = React.useContext(CourseContext);

    return (
        <View style={{ borderColor: "white", width: "90%", paddingTop: "20px" }}>
            <DataTable style={{ borderColor: "white" }}>
                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Course Start Date: </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Text style={{ color: "white", fontSize: 15 }}>{dateConverter(course.startDate)}</Text>
                    </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Course End Date: </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Text style={{ color: "white", fontSize: 15 }}>{dateConverter(course.endDate)}</Text>
                    </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Course Description: </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Text style={{ color: "white", fontSize: 15 }}>
                            {course.courseDescription !== null ? course.courseDescription : "No Description available"}
                        </Text>
                    </DataTable.Cell>
                </DataTable.Row>
            </DataTable>
        </View>
    );

    function _getStartEndDate() {
        if (course.publishState === CoursePublishState.UNPUBLISHED) {
            return (
                <>
                    {_getDate(i18n.t("itrex.startDate"), course.startDate)}
                    {_getDate(i18n.t("itrex.endDate"), course.endDate)}
                </>
            );
        }

        if (course.publishState === CoursePublishState.PUBLISHED) {
            return (
                <>
                    {_getDate(i18n.t("itrex.startDate"), course.startDate)}
                    {_getDate(i18n.t("itrex.endDate"), course.endDate)}
                </>
            );
        }

        return;
    }

    function _getDate(title: string, date?: Date) {
        return (
            <View style={styles.dateContainer}>
                <Text style={styles.textWhite}>{dateConverter(date)}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: "row",
    },
    textWhiteBold: {
        color: "white",
        fontWeight: "bold",
    },
    textWhite: {
        color: "white",
    },
    dualButtonContainer: {
        height: 70,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "row",
        paddingRight: "20px",
        paddingLeft: "20px",
    },
    horizontalSeparator: {
        marginEnd: 10,
    },
});
