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

const filterOptions = [
    { value: "PUBLISHED", label: "Published" },
    { value: "UNPUBLISHED", label: "Unpublished" },
    { value: "ALL", label: "All" },
];

//TODO: Replace with real endpoint-logic
function fetchCourses(publishState: string): ICourse[] {
    const filteredCourses: ICourse[] = [];

    if (publishState === "ALL") {
        return courseList;
    }
    for (const course of courseList) {
        if (course.publishState === publishState) {
            filteredCourses.push(course);
        }
    }

    return filteredCourses;
}

export const ScreenHomeLecturer: React.FC = () => {
    const navigation = useNavigation();
    const { t } = React.useContext(LocalizationContext);

    const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);

    const [selectedPublishStateFilter, setPublishStateFilter] = useState<string | undefined>(filterOptions[0].value);

    useEffect(() => {
        console.log(selectedPublishStateFilter);
        if (selectedPublishStateFilter === undefined) {
            return;
        }
        setFilteredCourses(fetchCourses(selectedPublishStateFilter));
    }, [selectedPublishStateFilter]);

    return (
        <View>
            <Text>{i18n.t("itrex.homeLecturerText")}</Text>
            <View style={{ width: 300, zIndex: 10 }}>
                <Text>Filter for published/unpublished courses</Text>
                <Select
                    options={filterOptions}
                    defaultValue={filterOptions[0]}
                    onChange={(option) => {
                        setPublishStateFilter(option?.value);
                    }}
                />
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
