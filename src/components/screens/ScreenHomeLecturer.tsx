import { ImageBackground, StyleSheet, Text, View } from "react-native";

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { CourseList } from "../CourseList";
import { courseList } from "../../constants/fixtures/courseList.fixture";
import i18n from "../../locales";
import Select from "react-select";
import { ICourse } from "../../types/ICourse";
import { Header } from "../../constants/navigators/Header";
import { LocalizationContext } from "../Context";

export const ScreenHomeLecturer: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);

    const [selectedPublishStateFilter, setPublishStateFilter] = useState<string | undefined>("PUBLISHED");
    const [selectedActiveState, setSelectedActiveState] = useState<string | undefined>("ACTIVE");

    useEffect(() => {
        if (selectedPublishStateFilter === undefined) {
            return;
        }
        if (selectedActiveState === undefined) {
            return;
        }
        const courseList: ICourse[] = fetchCourses(selectedPublishStateFilter, selectedActiveState);
        setFilteredCourses(courseList);
    }, [selectedPublishStateFilter, selectedActiveState]);

    function filter() {
        if (filteredCourses === undefined) {
            return;
        } else if (filteredCourses.length > 0) {
            return (
                <View style={{ flexDirection: "row", zIndex: 1 }}>
                    <View style={{ width: 300, zIndex: 3 }}>
                        <Text style={{ color: "white" }}>Filter for published/unpublished courses</Text>
                        <Select
                            options={publishStateFilterOptions}
                            defaultValue={publishStateFilterOptions[0]}
                            onChange={(option) => {
                                setPublishStateFilter(option?.value);
                            }}
                        />
                    </View>
                    <View style={{ width: 300, zIndex: 3 }}>
                        <Text style={{ color: "white" }}>Filter for active/inactive courses</Text>
                        <Select
                            options={activeStateFilterOptions}
                            defaultValue={activeStateFilterOptions[0]}
                            onChange={(option) => {
                                setSelectedActiveState(option?.value);
                            }}
                        />
                    </View>
                </View>
            );
        }
    }

    return (
        <View style={styles.container}>
            <Header title={i18n.t("itrex.home")} />
            <ImageBackground source={require("../../constants/images/Background2.png")} style={styles.image}>
                <Text style={{ color: "white" }}>{i18n.t("itrex.homeLecturerText")}</Text>
                {filter()}
                <CourseList courses={filteredCourses} />
            </ImageBackground>
        </View>
    );
};

const publishStateFilterOptions = [
    { value: "PUBLISHED", label: "Published" },
    { value: "UNPUBLISHED", label: "Unpublished" },
    { value: "ALL", label: "All" },
];

const activeStateFilterOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "ALL", label: "All" },
];

//TODO: Replace with real endpoint-logic and export to other file
function fetchCourses(publishState: string, setSelectedActiveState: string): ICourse[] {
    // initial : all relevant courses
    let filteredCourses: ICourse[] = courseList;
    if (publishState !== "ALL") {
        filteredCourses = getMatchingPublishStateCourses(publishState, filteredCourses);
    }
    if (setSelectedActiveState !== "ALL") {
        filteredCourses = getMatchingActivityStateCourses(setSelectedActiveState, filteredCourses);
    }
    return filteredCourses;
}

//TODO: Replace with real endpoint-logic
function getMatchingPublishStateCourses(publishState: string, inputCourseList: ICourse[]): ICourse[] {
    const filteredCourses: ICourse[] = [];

    for (const course of inputCourseList) {
        if (course.publishState === publishState) {
            filteredCourses.push(course);
        }
    }
    return filteredCourses;
}

//TODO: Replace with real endpoint-logic and export to other file
// eslint-disable-next-line complexity
function getMatchingActivityStateCourses(activeState: string, inputCourseList: ICourse[]): ICourse[] {
    const activeCourses: ICourse[] = [];
    const inactiveCourses: ICourse[] = [];

    // Curr date
    const offset = new Date();
    // Offset = Curr date + 8 weeks
    offset.setDate(offset.getDate() + 8 * 7);

    for (const course of inputCourseList) {
        if (course.endDate && course.endDate <= offset) {
            activeCourses.push(course);
        } else {
            inactiveCourses.push(course);
        }
    }

    return activeState === "ACTIVE" ? activeCourses : inactiveCourses;
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
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    icon: {
        width: 100,
        height: 100,
    },
    textSytle: {
        color: "white",
    },
});
