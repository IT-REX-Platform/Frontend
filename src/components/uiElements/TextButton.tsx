import * as React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";
import { dark } from "../../constants/themes/dark";

interface ButtonProps {
    title: string;
    size?: string;
    color?: string;
    fontSize?: string;
    onPress?: (event: GestureResponderEvent) => void;
}

export const TextButton: React.FC<ButtonProps> = (props) => {
    const buttonSize = _setButtonSize(props);
    const buttonColor = _setButtonColor(props);
    const fontSize = _setFontSize(props);

    return (
        <TouchableOpacity style={[styles.button, buttonSize, buttonColor]} onPress={props.onPress}>
            <Text style={[fontSize]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

function _setButtonSize(props: ButtonProps) {
    switch (props.size) {
        case "medium":
            return styles.mediumButton;
        case "large":
            return styles.largeButton;
        default:
            return styles.smallButton;
    }
}

function _setButtonColor(props: ButtonProps) {
    switch (props.color) {
        case "dark":
            return styles.darkBlue;
        case "pink":
            return styles.pink;
        default:
            return styles.lightBlue;
    }
}

function _setFontSize(props: ButtonProps) {
    switch (props.fontSize) {
        case "medium":
            return styles.mediumText;
        case "large":
            return styles.largeText;
        default:
            return styles.smallText;
    }
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        borderRadius: 30,
        margin: 10,
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
    pink: {
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
        marginBottom: 5,
    },
    largeText: {
        fontSize: 26,
        color: "#FFFFFF",
        marginBottom: 5,
    },
    smallButton: {
        width: "50%",
        minWidth: 150,
        maxWidth: 250,
        height: 30,
    },
    mediumButton: {
        width: "55%",
        minWidth: 200,
        maxWidth: 250,
        height: 40,
    },
    largeButton: {
        width: "65%",
        minWidth: 250,
        maxWidth: 300,
        height: 50,
    },
});
