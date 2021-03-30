import { dark } from "../../constants/themes/dark";
import { StyleSheet } from "react-native";

export const contentPoolStyles = StyleSheet.create({
    imageContainer: {
        backgroundColor: dark.theme.darkBlue1,
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center", // Prevents video list item names from being unnecessary cut, don't use alignItems: "center"
    },
    header: {
        textAlign: "center",
        color: dark.theme.pink,
        fontSize: 50,
    },
    addContentContainer: {
        width: "50%",
        alignSelf: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 5,
    },
    infoText: {
        textAlign: "center",
        margin: 5,
        color: "white",
    },
    loadingIcon: {
        margin: 5,
    },
    videoListDownloadingContainer: {
        flex: 1,
        justifyContent: "center",
    },
    contentListContainer: {
        flex: 1,
        maxWidth: "100%",
        alignItems: "center",
    },
    refreshButton: {
        alignSelf: "center",
        padding: 20,
    },
    infoTextBox: {
        padding: 50,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 5,
    },
    contentList: {
        height: 1, // Actual value is unimportant, this just makes the video list permanently scrollable, disregarding the current view height.
        marginBottom: 20,
    },
    listItemTitle: {
        color: "white",
        fontWeight: "bold",
    },
    listItemSubtitle: {
        color: "white",
    },
    deleteButton: {
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 2,
    },
    deleteIcon: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingStart: 20,
        paddingEnd: 20,
    },
});
