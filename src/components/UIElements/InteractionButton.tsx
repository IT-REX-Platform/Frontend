/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";

interface ButtonProps {
    title: string;
    type?: string;
    size?: string;
    color?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPress?: any;
}

export const InteractionButton: React.FC<ButtonProps> = (props) => {
    const { locale, setLocale } = React.useContext(LocalizationContext);

    const ButtonSize =
        props.size === "small" ? styles.smallButton : props.size === "large" ? styles.largeButton : styles.mediumButton;

    const ButtonType =
        props.type === "red"
            ? styles.warningButton
            : props.type === "green"
            ? styles.approveButton
            : styles.normalButton;

    const TextType =
        props.type === "red" ? styles.warningText : props.type === "green" ? styles.approveText : styles.normalText;

    const ButtonColor = props.color === "light" ? styles.lightBlue : styles.darkBlue;

    return (
        <TouchableOpacity style={[styles.button, ButtonSize, ButtonType, ButtonColor]} onPress={props.onPress}>
            <Text style={[styles.buttonText, TextType]}>{props.title}</Text>
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#003B66",
        shadowRadius: 10,
        shadowColor: "#003B66",
        shadowOpacity: 0.5,
        borderWidth: 3,
    },
    buttonText: {
        fontSize: 20,
        marginRight: 5,
    },

    darkBlue: {
        backgroundColor: "#003B66",
        shadowRadius: 10,
        shadowColor: "#003B66",
        shadowOpacity: 0.5,
    },
    lightBlue: {
        backgroundColor: "#3D96F3",
        shadowRadius: 10,
        shadowColor: "#3D96F3",
        shadowOpacity: 0.5,
    },
    normalButton: {
        borderColor: "#FFFFFF",
    },
    approveButton: {
        borderColor: "#32CD32",
    },
    warningButton: {
        borderColor: "#FF0000",
    },
    normalText: {
        color: "#FFFFFF",
    },
    approveText: {
        color: "#32CD32",
    },
    warningText: {
        color: "#FF0000",
    },
    smallButton: {
        minWidth: 200,
        height: 30,
    },
    mediumButton: {
        minWidth: 300,
        height: 40,
    },
    largeButton: {
        minWidth: 400,
        height: 50,
    },
});
