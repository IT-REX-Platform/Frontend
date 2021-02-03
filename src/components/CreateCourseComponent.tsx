import React from "react";
import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { Course, createPostRequest } from "../api/createPostRequest";
import { sendRequest } from "../api/sendRequest";
import { LocalizationContext } from "../App";
import { validateCourseName } from "../helperScripts/validateCourseName";
import i18n from "../locales";

export const CreateCourseComponent: React.FC = () => {
    const [courseName, setCourseName] = useState("");
    React.useContext(LocalizationContext);
    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>{i18n.t("itrex.enterCourseName")}</Text>
                    <TextInput
                        onChangeText={(text: string) => setCourseName(text)}
                        style={styles.StyledTextInput}
                        testID="courseNameInput"></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title={i18n.t("itrex.createCourse")} onPress={createCourse}></Button>
                </Pressable>
            </View>
        </>
    );

    function createCourse() {
        if (validateCourseName(courseName)) {
            console.log("sending a request: ", courseName);
            const currentDate: Date = new Date();
            const course: Course = { name: courseName, startDate: currentDate };
            const postRequest: RequestInit = createPostRequest(course);
            sendRequest(postRequest);
        } else {
            console.log("Course name invalid");
        }
    }
};

const styles = StyleSheet.create({
    container: {
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
