import { dark } from "../../constants/themes/dark";
import { StyleSheet } from "react-native";

export const videoPoolStyles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center", // Prevents video list item names from being unnecessary cut.
    },
    header: {
        textAlign: "center",
        color: dark.theme.pink,
        fontSize: 50,
    },
    videoUploadingContainer: {
        width: "95%",
        alignSelf: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    videoUploadContainer: {
        width: "95%",
        alignSelf: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    infoText: {
        maxWidth: "90%",
        textAlign: "center",
        margin: 10,
        fontSize: 20,
        color: "white",
    },
    button: {
        margin: 5,
        backgroundColor: dark.theme.darkBlue4,
        borderRadius: 2,
    },
    buttonText: {
        padding: 10,
        fontSize: 20,
        color: "white",
    },
    videoListDownloadingContainer: {
        flex: 1,
        justifyContent: "center",
    },
    videoListContainer: {
        flex: 1,
        maxWidth: "100%",
        alignItems: "center",
    },
    refreshButton: {
        padding: 20,
    },
    infoTextBox: {
        maxWidth: "95%",
        marginTop: 50,
        padding: 50,
        backgroundColor: dark.theme.darkBlue2,
        borderColor: dark.theme.darkBlue4,
        borderWidth: 2,
        borderRadius: 2,
    },
    videoList: {
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
    },
    deleteIcon: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingStart: 20,
        paddingEnd: 20,
    },
});
