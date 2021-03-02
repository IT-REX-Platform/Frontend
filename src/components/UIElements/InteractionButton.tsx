/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";

interface ButtonProps {
    title: string;
    type?: string;
    size?: string;
    color?: string;
    fontsize?: string;
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

    const FontSize =
        props.fontsize === "small"
            ? styles.smallText
            : props.fontsize === "large"
            ? styles.largeText
            : styles.mediumText;

    const ButtonColor = props.color === "dark" ? styles.darkBlue : styles.lightBlue;

    return (
        <TouchableOpacity style={[styles.button, ButtonSize, ButtonType, ButtonColor]} onPress={props.onPress}>
            <Text style={[TextType, FontSize]}>{props.title}</Text>
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
        backgroundColor: dark.theme.darkBlue3,
        shadowRadius: 10,
        shadowColor: dark.theme.darkBlue3,
        shadowOpacity: 0.5,
        borderWidth: 3,
    },

    darkBlue: {
        backgroundColor: dark.theme.darkBlue3,
        shadowRadius: 10,
        shadowColor: dark.theme.darkBlue3,
        shadowOpacity: 0.5,
    },
    lightBlue: {
        backgroundColor: dark.Opacity.blueGreen,
        shadowRadius: 10,
        shadowColor: dark.Opacity.blueGreen,
        shadowOpacity: 0.5,
    },
    smallText: {
        fontSize: 15,
    },
    mediumText: {
        fontSize: 20,
    },
    largeText: {
        fontSize: 26,
        marginBottom: 5,
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
