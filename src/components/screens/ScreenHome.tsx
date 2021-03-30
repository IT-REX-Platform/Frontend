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
            return;
        }

        return (
            <View style={styles.card}>
                <View style={styles.filterContainer}>
                    {userRole !== ITREXRoles.ROLE_STUDENT && (
                        <View style={{ padding: 8, flex: 1 }}>
                            <Text style={styles.label}>{i18n.t("itrex.filterPubUnpub")}</Text>
                            <DropDown
                                options={publishStateFilterOptions}
                                defaultValue={defaultPublishStateValue}
                                onChange={(option) => setPublishStateFilter(option?.value)}
                            />
                        </View>
                    )}
                    <View style={{ padding: 8, flex: 1 }}>
                        <Text style={styles.label}>{i18n.t("itrex.filterActiveInActive")}</Text>
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
                <View style={styles.centeredView}>
                    <TextButton
                        title={i18n.t("itrex.joinACourse")}
                        size="medium"
                        onPress={() => navigation.navigate(NavigationRoutes.ROUTE_JOIN_COURSE)}
                    />
                </View>
            );
        }

        return (
            <View style={styles.centeredView}>
                <TextButton
                    title={i18n.t("itrex.createCourse")}
                    size="medium"
                    onPress={() => navigation.navigate(NavigationRoutes.ROUTE_CREATE_COURSE)}
                />
            </View>
        );
    }

    return (
        <>
            <Header title={i18n.t("itrex.home")} />
            <ImageBackground source={require("../../constants/images/Background2.png")} style={styles.imageContainer}>
                {renderFilters()}
                {renderCourseList()}
            </ImageBackground>
        </>
    );
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
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "flex-start",
    },
    card: {
        marginTop: 10,
        maxWidth: "50%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        zIndex: 11,
    },
    filterContainer: {
        flexGrow: 4,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    centeredView: {
        marginTop: 15,
        alignSelf: "center",
    },
    label: {
        color: "white",
        textAlign: "center",
    },
});
