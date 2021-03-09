import React from "react";
import i18n from "../locales";
import { LocalizationContext } from "./Context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dark } from "../constants/themes/dark";
import { IChapter } from "../types/IChapter";
import { MaterialIcons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigation } from "@react-navigation/native";
import { InfoPublished } from "./uiElements/InfoPublished";
import { InfoUnpublished } from "./uiElements/InfoUnpublished";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
}

export const ChapterComponent: React.FC<ChapterComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const chapter = props.chapter;
    return (
        <View style={styles.chapterContainer}>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>{chapter?.title}</Text>
                {/* TODO: add real publish/unpublished state to the chapterss*/}
                <View style={styles.chapterStatus}>{getPublishedSate("PUBLISHED")}</View>
            </View>
            <View style={styles.chapterBottomRow}>
                <Text style={styles.chapterMaterialHeader}>{i18n.t("itrex.chapterMaterial")}</Text>
                <View style={styles.chapterMaterialElements}>
                    {chapter?.contents?.map((contentId) => {
                        return (
                            <View style={styles.chapterMaterialElement}>
                                <MaterialIcons name="attach-file" size={28} color="white" style={styles.icon} />
                                <Text style={styles.chapterMaterialElementText}>{contentId}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
            {props.editMode && AuthenticationService.getInstance().isLecturer() && (
                <View style={styles.chapterEditRow}>
                    {/**<TouchableOpacity
                        onPress={() => {
                            courseService.deleteChapter(chapter?.id);
                        }}>
                        <MaterialCommunityIcons name="trash-can" size={28} color="white" style={styles.icon} />
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("CHAPTER", { chapterId: chapter?.id });
                        }}>
                        <MaterialIcons name="edit" size={28} color="white" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    function getPublishedSate(isPublished: string | undefined) {
        if (isPublished === "UNPUBLISHED") {
            return (
                <>
                    <InfoUnpublished />
                </>
            );
        } else if (isPublished === "PUBLISHED") {
            return (
                <>
                    <InfoPublished />
                </>
            );
        }

        return;
    }
};

const styles = StyleSheet.create({
    chapterContainer: {
        backgroundColor: "rgba(0,0,0,0.3)",
        width: "80%",
        marginTop: "1%",
        padding: "1.5%",
        borderWidth: 3,
        borderColor: dark.theme.darkGreen,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    chapterTopRow: {
        width: "100%",
        flex: 2,
    },
    chapterBottomRow: {
        width: "100%",
        flex: 1,
        alignItems: "baseline",
        paddingTop: "1%",
    },
    chapterEditRow: {
        width: "100%",
        flex: 2,
        flexDirection: "row-reverse",
    },
    chapterHeader: {
        alignSelf: "flex-start",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    chapterStatus: {
        alignSelf: "flex-end",
        position: "absolute",
        color: "white",
        fontWeight: "bold",
    },
    chapterMaterialHeader: {
        alignSelf: "center",
        color: "white",
        fontWeight: "bold",
    },
    chapterMaterialElements: {
        paddingTop: "20px",
        flex: 1,
        flexDirection: "row",
        alignSelf: "center",
    },
    chapterMaterialElement: {
        flex: 1,
        flexDirection: "row",
        color: "white",
        fontWeight: "bold",
        alignItems: "center",
    },
    chapterMaterialElementText: {
        color: "white",
        fontWeight: "bold",
    },
    icon: {
        paddingLeft: 10,
        paddingRight: 10,
    },
});
