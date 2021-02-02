import React from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View } from "react-native";
import { LocalizationContext } from "../App";

export const UploadVideoComponent: React.FC = () => {
    const { t } = React.useContext(LocalizationContext);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>Upload Video here:</Text>
                    <TextInput defaultValue={t("itrex.videoName")} style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title={t("itrex.browseFiles")} onPress={changeStyle}></Button>
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
