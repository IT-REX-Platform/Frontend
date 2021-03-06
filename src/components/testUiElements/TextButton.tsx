/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";

interface ButtonProps {
    title: string;
    size?: string;
    color?: string;
    fontsize?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPress?: any;
}

export const TextButton: React.FC<ButtonProps> = (props) => {
    const { locale, setLocale } = React.useContext(LocalizationContext);

    const ButtonSize =
        props.size === "small" ? styles.smallButton : props.size === "large" ? styles.largeButton : styles.mediumButton;

    const FontSize =
        props.fontsize === "medium"
            ? styles.mediumText
            : props.fontsize === "large"
            ? styles.largeText
            : styles.smallText;

    const ButtonColor =
        props.color === "dark" ? styles.darkBlue : props.color === "pink" ? styles.red : styles.lightBlue;

    return (
        <TouchableOpacity style={[styles.button, ButtonSize, ButtonColor]} onPress={props.onPress}>
            <Text style={[FontSize]}>{props.title}</Text>
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
        shadowRadius: 10,
        shadowOpacity: 0.5,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },

    darkBlue: {
        backgroundColor: dark.Opacity.darkBlue1,
        shadowColor: dark.Opacity.darkBlue1,
    },
    lightBlue: {
        backgroundColor: dark.Opacity.blueGreen,
        shadowColor: dark.Opacity.blueGreen,
    },
    red: {
        backgroundColor: dark.Opacity.pink,
        shadowColor: dark.Opacity.pink,
    },
    smallText: {
        fontSize: 15,
        color: "#FFFFFF",
    },
    mediumText: {
        fontSize: 20,
        color: "#FFFFFF",
    },
    largeText: {
        fontSize: 26,
        color: "#FFFFFF",
        marginBottom: 5,
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
