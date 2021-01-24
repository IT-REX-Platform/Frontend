import React, { useState } from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View, SafeAreaView } from "react-native";
import i18n from "../locales/index";

export const UploadVideoComponent = () => {
    const [setVideo] = useState("");

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>{i18n.t("itrex.uploadVideo")}</Text>
                    <TextInput defaultValue={i18n.t("itrex.videoName")} style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title={i18n.t("itrex.browseFiles")} onPress={changeStyle}></Button>
                </Pressable>
            </SafeAreaView>
        </>
    );

    function changeStyle() {}
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    StyledInputContainer: {
        flexDirection: "column",
    },
    StyledTextInput: {
        borderColor: "lightgray",
        borderWidth: 2,
    },
    StyledButton: {
        marginTop: 16,
    },
});
