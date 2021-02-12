import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { LocalizationContext } from "../App";

export const CourseDetailsComponent: React.FC = () => {
    const route = useRoute();
    const courseDetails = route.params;
    console.log(courseDetails);

    React.useContext(LocalizationContext);

    return (
        <>
            <ImageBackground source={require("../constants/images/Background_forest.svg")} style={styles.image}>
                <Text>
                    <h1>Hier könnte ihre Werbung stehen</h1>
                </Text>
                <Text>{JSON.stringify(courseDetails)}</Text>;
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
});
