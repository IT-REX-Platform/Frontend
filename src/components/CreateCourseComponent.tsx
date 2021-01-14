import React from "react";
import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";
import { validateCourseName } from "../helperScripts/validateCourseName";
import styled from "styled-components";
import { ClassNameProp } from "../types/ClassNameProp";

export const CreateCourseComponent: React.FC<ClassNameProp> = () => {
    const [courseName, onChangeCourseName] = useState("");

    return (
        <>
            <View style={styles.container}>
                <Text>Enter Course name:</Text>
                <StyledTextInput onChangeText={(text) => onChangeCourseName(text)}></StyledTextInput>
                <StyledButton title="Create new Course" onPress={sendRequest}></StyledButton>
            </View>
        </>
    );

    function sendRequest() {
        if (validateCourseName(courseName)) {
            console.log("sending a request: ", courseName);
        } else {
            console.log("Course name invalid");
        }
    }
};

const StyledCreateCourseContainer = styled(View)`
    flex: 1;
    background-color: "#fff";
    align-items: "center";
    justify-content: "center";
`;

const StyledTextInput = styled(TextInput)`
    margin-top: 8;
    border-color: lightgray;
    border-width: 1;
`;

const StyledButton = styled(Button)`
    margin-top: 16;
`;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
