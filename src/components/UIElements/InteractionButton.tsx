import * as React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";

export const InteractionButton = ({ title, onPress }) => {
    const { locale, setLocale } = React.useContext(LocalizationContext);
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        height: 40,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#003B66",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 20,
        marginRight: 5,
    },
});
