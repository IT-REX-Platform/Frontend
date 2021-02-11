import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";
import { LocalizationContext } from "../App";

export const CourseDetailsComponent: React.FC = () => {
    const route = useRoute();
    const courseDetails = route.params;
    console.log(courseDetails);

    React.useContext(LocalizationContext);

    return (
        <>
            <Text>
                <h1>Hier könnte ihre Werbung stehen</h1>
            </Text>
            <Text>{JSON.stringify(courseDetails)}</Text>;
        </>
    );
};
