import React from "react";
import { StyleSheet, Button, Pressable, TextInput, Text, View, ImageBackground } from "react-native";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { Header } from "../constants/navigators/Header";

export const UploadVideoComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    return (
        <ImageBackground source={require("../constants/images/Background_forest.svg")} style={styles.image}>
            <Header title={i18n.t("itrex.toUploadVideo")} />
            <View style={styles.container}>
                <View style={styles.StyledInputContainer}>
                    <Text>{i18n.t("itrex.uploadVideoHere")}</Text>
                    <TextInput style={styles.StyledTextInput}></TextInput>
                </View>
                <Pressable style={styles.StyledButton}>
                    <Button title={i18n.t("itrex.browseFiles")} onPress={changeStyle}></Button>
                </Pressable>
            </View>
        </ImageBackground>
    );

    function changeStyle() {
        return undefined;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
});
