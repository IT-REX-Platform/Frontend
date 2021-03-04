import { ImageBackground, StyleSheet, Text, View, Button } from "react-native";

import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import { ITREXRoles } from "../../constants/ITREXRoles";
import { createAlert } from "../../helperScripts/createAlert";

interface ScreenHomeProps {
    userRole: ITREXRoles;
}

export const ScreenHome: React.FC<ScreenHomeProps> = (props) => {
    const { userRole } = props;

    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const isFocused = useIsFocused();

    const [allCourses, setAllCourses] = useState<ICourse[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);

    const [selectedPublishStateFilter, setPublishStateFilter] = useState<CoursePublishState | undefined>(undefined);
    const [selectedActiveState, setSelectedActiveState] = useState<CourseActivityState | undefined>(
        CourseActivityState.ACTIVE
    );

    useEffect(() => {
        fetchCourses(selectedPublishStateFilter, selectedActiveState);
    }, [selectedPublishStateFilter, selectedActiveState, allCourses]);

    useEffect(() => {
        if (isFocused) {
            const request: RequestInit = RequestFactory.createGetRequest();
            endpointsCourse.getAllCourses(request).then((receivedCourses: ICourse[]) => {
                setAllCourses(receivedCourses);
            });
        }
    }, [isFocused]);

    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    function fetchCourses(
        publishState: CoursePublishState | undefined,
        setSelectedActiveState: CourseActivityState | undefined
    ): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        const activeOnly = getEndDateBasedOnFilter(setSelectedActiveState);

        // Only show published courses to student
        if (userRole === ITREXRoles.ROLE_STUDENT) {
            publishState = CoursePublishState.PUBLISHED;
        }

        const filterParams: ICourse = { publishState, activeOnly };

        endpointsCourse.getAllCourses(request, filterParams).then((receivedCourses: ICourse[]) => {
            setFilteredCourses(receivedCourses);
        });
    }

    function renderFilters() {
        if (allCourses.length < 1) {
            return undefined;
        }
        return (
            <View style={{ flexDirection: "row", zIndex: 1, justifyContent: "flex-start" }}>
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>{i18n.t("itrex.filterLabel")}</Text>
                    {userRole !== ITREXRoles.ROLE_STUDENT && (
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
                    )}
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

    function courseList() {
        if (allCourses.length < 1) {
            noCoursesAvailable();
        } else {
            return <CourseList courses={filteredCourses} />;
        }
    }

    function noCoursesAvailable() {
        if (userRole === ITREXRoles.ROLE_STUDENT) {
            return (
                <View style={styles.cardView}>
                    <View style={[{ width: "20%", marginTop: 15 }]}>
                        <Button
                            color={dark.Opacity.blueGreen}
                            title="Join a course"
                            onPress={() => createAlert("Navigate to a Course Search Page to join a Course")}
                        />
                    </View>
                </View>
            );
        }
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
    }

    return (
        <View style={styles.container}>
            <Header title={i18n.t("itrex.home")} />
            <ImageBackground source={require("../../constants/images/Background2.png")} style={styles.image}>
                {renderFilters()}

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
    // Functionality in Backend currently not available for next line
    // { value: CourseActivityState.INACTIVE, label: i18n.t("itrex.inactive") },
    { value: undefined, label: i18n.t("itrex.all") },
];

function getEndDateBasedOnFilter(setSelectedActiveState: CourseActivityState | undefined): boolean | undefined {
    if (setSelectedActiveState === CourseActivityState.ACTIVE) {
        return true;
    }
    // Functionality in Backend currently not available for next lines
    // if (setSelectedActiveState === CourseActivityState.INACTIVE) {
    //     return false;
    // }

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
