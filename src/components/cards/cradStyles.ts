import { StyleSheet } from "react-native";
import { dark } from "../../constants/themes/dark";

export const cardStyles = StyleSheet.create({
    card: {
        shadowRadius: 10,
        shadowOffset: { width: -1, height: 1 },
        margin: 8,
        minWidth: "40%",
        marginRight: 20,
        backgroundColor: dark.Opacity.darkBlue1,
        textAlign: "center",
    },
    cardChoicesRight: {
        margin: 8,
        minHeight: 40,
        width: "40%",
        backgroundColor: dark.Opacity.darkGreen,
        borderColor: dark.theme.darkGreen,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
    },
    cardChoicesWrong: {
        minHeight: 40,
        margin: 8,
        width: "40%",
        backgroundColor: dark.Opacity.pink,
        borderColor: dark.theme.pink,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
    },
    cardHeader: {
        margin: 8,
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
        marginTop: 1,
    },
    textChoice: {
        color: "white",
        fontSize: 20,
    },
});
