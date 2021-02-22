import { Button, Text, View } from "react-native";

import React, { useEffect, useState } from "react";
import { CreateCourseComponent } from "../CreateCourseComponent";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../../constants/NavigationRoutes";
import { LocalizationContext } from "../../App";
import { CourseList } from "../CourseList";
import { courseList } from "../../constants/fixtures/courseList.fixture";
import i18n from "../../locales";
import Select from "react-select";
import { ICourse } from "../../types/ICourse";

export const ScreenHomeLecturer: React.FC = () => {
    const navigation = useNavigation();
    const { t } = React.useContext(LocalizationContext);

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

    return (
        <View>
            <Text>{i18n.t("itrex.homeLecturerText")}</Text>
            <View style={{ flexDirection: "row", zIndex: 1 }}>
                <View style={{ width: 300, zIndex: 3 }}>
                    <Text>Filter for published/unpublished courses</Text>
                    <Select
                        options={publishStateFilterOptions}
                        defaultValue={publishStateFilterOptions[0]}
                        onChange={(option) => {
                            setPublishStateFilter(option?.value);
                        }}
                    />
                </View>
                <View style={{ width: 300, zIndex: 3 }}>
                    <Text>Filter for active/inactive courses</Text>
                    <Select
                        options={activeStateFilterOptions}
                        defaultValue={activeStateFilterOptions[0]}
                        onChange={(option) => {
                            setSelectedActiveState(option?.value);
                        }}
                    />
                </View>
            </View>
            <CourseList courses={filteredCourses} />
            <CreateCourseComponent />
            <Button
                title="Go to Upload Video"
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />
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
