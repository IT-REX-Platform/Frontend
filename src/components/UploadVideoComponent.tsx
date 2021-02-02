import React from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View, SafeAreaView } from "react-native";
import { LocalizationContext } from "../App";

export const UploadVideoComponent: React.FC = () => {
    const { t } = React.useContext(LocalizationContext);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>{t("itrex.uploadVideo")}</Text>
                    <TextInput defaultValue={t("itrex.videoName")} style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title={t("itrex.browseFiles")} onPress={changeStyle}></Button>
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
