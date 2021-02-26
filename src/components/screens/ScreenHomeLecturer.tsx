import { ImageBackground, StyleSheet, Text, View, Button } from "react-native";

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { CourseList } from "../CourseList";
import i18n from "../../locales";
import Select from "react-select";
import { ICourse } from "../../types/ICourse";
import { Header } from "../../constants/navigators/Header";
import { LocalizationContext } from "../Context";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import { CoursePublishState } from "../../constants/CoursePublishState";
import { CourseActivityState } from "../../constants/CourseActivityState";
import { dark } from "../../constants/themes/dark";
import { courseList } from "../../constants/fixtures/courseList.fixture";
import { red400 } from "react-native-paper/lib/typescript/styles/colors";
import { createAlert } from "../../helperScripts/createAlert";
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import AuthenticationService from "../../services/AuthenticationService";
import { ITREXRoles } from "../../constants/ITREXRoles";

export const ScreenHomeLecturer: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);

    const [selectedPublishStateFilter, setPublishStateFilter] = useState<CoursePublishState | undefined>(
        CoursePublishState.PUBLISHED
    );
    const [selectedActiveState, setSelectedActiveState] = useState<CourseActivityState | undefined>(
        CourseActivityState.ACTIVE
    );

    useEffect(() => {
        fetchCourses(selectedPublishStateFilter, selectedActiveState);
    }, [selectedPublishStateFilter, selectedActiveState]);

    console.log(filteredCourses);
    console.log(selectedPublishStateFilter);
    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    function fetchCourses(
        publishState: CoursePublishState | undefined,
        setSelectedActiveState: CourseActivityState | undefined
    ): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        // Set stuff here
        const endDate = getEndDateBasedOnFilter(setSelectedActiveState);

        const filterParams: ICourse = { publishState: publishState };
        console.log(filterParams);

        endpointsCourse.getAllCourses(request, filterParams).then((receivedCourses: ICourse[]) => {
            setFilteredCourses(receivedCourses);
        });
    }

    function renderFilters() {
        // TODO: Check if courseList > 0 before showing
        // Don't know how to do that. Page is not rendered when accessing it via navbar. This is problematic
        return (
            <View style={{ flexDirection: "row", zIndex: 1, justifyContent: "flex-end" }}>
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>{i18n.t("itrex.filterLabel")}</Text>
                    <View style={{ width: 250, margin: 5, justifyContent: "center" }}>
                        <Text style={{ color: "white" }}>{i18n.t("itrex.filterPubUnpub")}</Text>
                        <Select
                            options={publishStateFilterOptions}
                            defaultValue={publishStateFilterOptions[0]}
                            onChange={(option) => {
                                setPublishStateFilter(option?.value);
                            }}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 5,
                                colors: {
                                    ...theme.colors,
                                    primary25: dark.Opacity.darkBlue1,
                                    primary: dark.Opacity.pink,
                                    backgroundColor: dark.Opacity.darkBlue1,
                                },
                            })}
                        />
                    </View>

                    <View style={{ width: 250, margin: 5 }}>
                        <Text style={{ color: "white" }}>{i18n.t("itrex.filterActiveInActive")}</Text>
                        <Select
                            options={activeStateFilterOptions}
                            defaultValue={activeStateFilterOptions[0]}
                            onChange={(option) => {
                                setSelectedActiveState(option?.value);
                            }}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 5,
                                background: dark.theme.grey,
                                colors: {
                                    ...theme.colors,
                                    primary25: dark.Opacity.darkBlue1,
                                    primary: dark.Opacity.pink,
                                },
                            })}
                        />
                    </View>
                </View>
            </View>
        );
    }

    console.log("render new page");
    function courseList() {
        if (
            selectedPublishStateFilter === undefined &&
            selectedActiveState === undefined &&
            filteredCourses.length === 0
        ) {
            return (
                <View style={styles.cardView}>
                    <View style={[{ width: "20%", marginTop: 15 }]}>
                        <Button
                            color={dark.Opacity.blueGreen}
                            title={i18n.t("itrex.createCourse")}
                            onPress={() => navigation.navigate(NavigationRoutes.ROUTE_CREATE_COURSE)}
                        />
                    </View>
                </View>
            );
        } else {
            return <CourseList courses={filteredCourses} />;
        }
    }

    return (
        <View style={styles.container}>
            <Header title={i18n.t("itrex.home")} />
            <ImageBackground source={require("../../constants/images/Background2.png")} style={styles.image}>
                <Text style={{ color: "white" }}>{i18n.t("itrex.homeLecturerText")}</Text>
                {renderFilters()}
                {/* Use this for hardcoded courses */}
                {/*<CourseList courses={courseList} />*/}
                {/* Use this for courses from backend */}

                {courseList()}
            </ImageBackground>
        </View>
    );
};

const publishStateFilterOptions = [
    { value: CoursePublishState.PUBLISHED, label: i18n.t("itrex.published") },
    { value: CoursePublishState.UNPUBLISHED, label: i18n.t("itrex.unpublished") },
    { value: undefined, label: i18n.t("itrex.all") },
];

const activeStateFilterOptions = [
    { value: CourseActivityState.ACTIVE, label: i18n.t("itrex.active") },
    { value: CourseActivityState.INACTIVE, label: i18n.t("itrex.inactive") },
    { value: undefined, label: i18n.t("itrex.all") },
];

function getEndDateBasedOnFilter(setSelectedActiveState: CourseActivityState | undefined): Date | undefined {
    // Curr date
    const offset = new Date();
    // Offset = Curr date + 8 weeks
    offset.setDate(offset.getDate() + 8 * 7);

    if (setSelectedActiveState === CourseActivityState.ACTIVE) {
        return offset;
    }

    return undefined;
}

const styles = StyleSheet.create({
    textContainer: {
        marginTop: 20,
        marginBottom: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "flex-start",
    },
    icon: {
        width: 100,
        height: 100,
    },
    textSytle: {
        color: "white",
    },
    card: {
        flexDirection: "row",
        flexWrap: "wrap",
        margin: 5,
        maxWidth: 500,
        minWidth: 600,
        backgroundColor: dark.Opacity.grey,
        alignItems: "center",
        justifyContent: "center",
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
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
    },
    cardView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "center",
        marginTop: 15,
    },
});
