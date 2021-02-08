import { useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View } from "react-native";
import { LocalizationContext } from "../App";
import i18n from "../locales";

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

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    StyledInputContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    StyledTextInput: {
        marginLeft: 8,
        borderColor: "lightgray",
        borderWidth: 2,
    },
    StyledButton: {
        marginTop: 16,
    },
});
