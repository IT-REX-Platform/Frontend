import React from "react";
import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { ICourse } from "../types/ICourse";
import { sendRequest } from "../api/sendRequest";
import { validateCourseName } from "../helperScripts/validateCourseName";
import { RequestFactory } from "../api/RequestFactory";
import { loggerFactory } from "../../logger/LoggerConfig";

const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");

export const CreateCourseComponent: React.FC = () => {
    const [courseName, setCourseName] = useState("");

    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>Enter Course name:</Text>
                    <TextInput
                        onChangeText={(text: string) => setCourseName(text)}
                        style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title="Create new Course" onPress={createCourse}></Button>
                </Pressable>
            </View>
        </>
    );

    function createCourse() {
        if (validateCourseName(courseName)) {
            loggerService.trace(`sending a request: ${courseName}`);
            const currentDate: Date = new Date();
            const course: ICourse = { name: courseName, startDate: currentDate };
            const postRequest: RequestInit = RequestFactory.createPostRequest(course);
            sendRequest(postRequest);
        } else {
            loggerService.warn("Course name invalid");
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
