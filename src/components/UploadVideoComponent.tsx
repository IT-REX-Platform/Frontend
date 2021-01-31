import React from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View } from "react-native";

export const UploadVideoComponent: React.FC = () => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>Upload Video here:</Text>
                    <TextInput defaultValue="Document here" style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title="Browse Files" onPress={changeStyle}></Button>
                </Pressable>
            </View>
        </>
    );

    function changeStyle() {
        return undefined;
    }
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
