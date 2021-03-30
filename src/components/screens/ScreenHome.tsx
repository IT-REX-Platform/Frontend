import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { CourseList } from "../CourseList";
import i18n from "../../locales";
import { ICourse } from "../../types/ICourse";
import { Header } from "../../constants/navigators/Header";
import { LocalizationContext } from "../Context";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import { CoursePublishState } from "../../constants/CoursePublishState";
import { CourseActivityState } from "../../constants/CourseActivityState";
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import { ITREXRoles } from "../../constants/ITREXRoles";
import { ScrollView } from "react-native-gesture-handler";
import { DropDown } from "../uiElements/Dropdown";
import { TextButton } from "../uiElements/TextButton";
import { dark } from "../../constants/themes/dark";

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

    const defaultPublishStateValue = publishStateFilterOptions[2];
    const [selectedPublishStateFilter, setPublishStateFilter] = useState<CoursePublishState | undefined>(
        defaultPublishStateValue.value
    );

    const defaultActiveStateValue = activeStateFilterOptions[0];
    const [selectedActiveState, setSelectedActiveState] = useState<CourseActivityState | undefined>(
        defaultActiveStateValue.value
    );

    useEffect(() => {
        fetchCourses(selectedPublishStateFilter, selectedActiveState);
    }, [selectedPublishStateFilter, selectedActiveState, allCourses]);

    useEffect(() => {
        if (isFocused) {
            const request: RequestInit = RequestFactory.createGetRequest();
            endpointsCourse
                .getUserCourses(request, undefined, undefined, undefined, i18n.t("itrex.getCoursesError"))
                .then((receivedCourses: ICourse[]) => setAllCourses(receivedCourses));
        }
    }, [isFocused]);

    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    function fetchCourses(
        publishState: CoursePublishState | undefined,
        setSelectedActiveState: CourseActivityState | undefined
    ): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        const activeOnly: boolean | undefined = getEndDateBasedOnFilter(setSelectedActiveState);

        // Only show published courses to student
        if (userRole === ITREXRoles.ROLE_STUDENT) {
            publishState = CoursePublishState.PUBLISHED;
        }

        endpointsCourse
            .getUserCourses(request, publishState, activeOnly, undefined, i18n.t("itrex.getCoursesError"))
            .then((receivedCourses: ICourse[]) => setFilteredCourses(receivedCourses));
    }

    function renderFilters() {
        if (allCourses.length < 1) {
            return undefined;
        }
        return (
            <View style={styles.card}>
                <View style={styles.filterContainer}>
                    {userRole !== ITREXRoles.ROLE_STUDENT && (
                        <View style={{ padding: 8, flex: 1 }}>
                            <Text style={{ color: "white", textAlign: "center" }}>
                                {i18n.t("itrex.filterPubUnpub")}
                            </Text>
                            <DropDown
                                options={publishStateFilterOptions}
                                defaultValue={defaultPublishStateValue}
                                onChange={(option) => setPublishStateFilter(option?.value)}
                            />
                        </View>
                    )}
                    <View style={{ padding: 8, flex: 1 }}>
                        <Text style={{ color: "white", textAlign: "center" }}>
                            {i18n.t("itrex.filterActiveInActive")}
                        </Text>
                        <DropDown
                            options={activeStateFilterOptions}
                            defaultValue={defaultActiveStateValue}
                            onChange={(option) => setSelectedActiveState(option?.value)}
                        />
                    </View>
                </View>
            </View>
        );
    }

    function renderCourseList() {
        if (allCourses.length < 1) {
            return noCoursesAvailable();
        }

        return (
            <ScrollView>
                <CourseList courses={filteredCourses} />
            </ScrollView>
        );
    }

    function noCoursesAvailable() {
        if (userRole === ITREXRoles.ROLE_STUDENT) {
            return (
                <View style={styles.cardView}>
                    <View style={[{ marginTop: 15 }]}>
                        <TextButton
                            color="dark"
                            title={i18n.t("itrex.joinCourse")}
                            onPress={() => navigation.navigate(NavigationRoutes.ROUTE_JOIN_COURSE)}
                        />
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.cardView}>
                <View style={[{ marginTop: 15 }]}>
                    <TextButton
                        color="dark"
                        title={i18n.t("itrex.createCourse")}
                        onPress={() => navigation.navigate(NavigationRoutes.ROUTE_CREATE_COURSE)}
                    />
                </View>
            </View>
        );
    }

    if (userRole === ITREXRoles.ROLE_LECTURER) {
        return (
            <>
                <Header title={i18n.t("itrex.home")} />
                <View style={styles.rootContainer}>
                    <ImageBackground
                        source={require("../../constants/images/Background2.png")}
                        style={styles.image}
                        imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "cover" }}>
                        <View style={[styles.rowContainer, { marginBottom: "1.5%" }]}>
                            <View style={[styles.cellContainer, { marginRight: "1.5%" }]}>
                                {renderFilters()}
                                {renderCourseList()}
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </>
        );
    } else {
        return (
            <>
                <Header title={i18n.t("itrex.home")} />
                <View style={styles.rootContainer}>
                    {renderFilters()}

                    <ImageBackground
                        source={require("../../constants/images/Background3.png")}
                        style={styles.image}
                        imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "contain", paddingTop: 1000 }}>
                        {renderCourseList()}
                    </ImageBackground>
                </View>
            </>
        );
    }
};

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
    rootContainer: {
        flex: 2,
        flexDirection: "column",
        paddingTop: 48,
        paddingBottom: 48,
        backgroundColor: dark.theme.darkBlue1,
    },
    rowContainer: {
        flex: 2,
        flexDirection: "row",
    },
    cellContainer: {
        flex: 1,
        flexDirection: "column",
        //backgroundColor: dark.theme.darkBlue2,
        padding: 48,
    },
    image: {
        flex: 1,
        resizeMode: "contain",
        //justifyContent: "flex-start",
        //alignItems:"flex-start"
    },
    card: {
        marginTop: 10,
        paddingLeft: 48,
        maxWidth: "30%",
        flexDirection: "row",
        //alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: 11,
    },
    cardHeader: {
        padding: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        flexGrow: 1,
    },
    filterContainer: {
        flexGrow: 4,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    cardView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "center",
        marginTop: 15,
    },
});
