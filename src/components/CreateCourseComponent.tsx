import React from "react";
import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, Pressable, Alert } from "react-native";
import { sendCreateCourseRequest } from "../api/sendCreateCourseRequest";
import { validateCourseName } from "../helperScripts/validateCourseName";

export const CreateCourseComponent: React.FC = () => {
    const [courseName, onChangeCourseName] = useState("");

    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>Enter Course name:</Text>
                    <TextInput
                        onChangeText={(text: string) => onChangeCourseName(text)}
                        style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title="Create new Course" onPress={sendRequest}></Button>
                </Pressable>
            </View>
        </>
    );

    function sendRequest() {
        Alert.alert("Course creation", "Course created successfully.");

        if (validateCourseName(courseName)) {
            console.log("sending a request: ", courseName);
            sendCreateCourseRequest(courseName);
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
