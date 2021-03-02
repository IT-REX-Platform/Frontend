import React, { useState, useEffect } from "react";
import i18n from "../locales";
import { Header } from "../constants/navigators/Header";
import { CourseContext, LocalizationContext } from "./Context";
import {
    Button,
    ImageBackground,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { createAlert } from "../helperScripts/createAlert";
import { Video } from "expo-av";
import { IVideo } from "../types/IVideo";
import { VideoFormDataParams } from "../constants/VideoFormDataParams";
import { loggerFactory } from "../../logger/LoggerConfig";
import { createVideoUrl } from "../services/createVideoUrl";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { IChapter } from "../types/IChapter";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AuthenticationService from "../services/AuthenticationService";
import { ITREXRoles } from "../constants/ITREXRoles";
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
    CourseStackParamList,
    CourseTabParamList,
    RootDrawerParamList,
} from "../constants/navigators/NavigationRoutes";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";

const loggerService = loggerFactory.getLogger("component.ChapterComponent");

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
}

export const ChapterComponent: React.FC<ChapterComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const chapter = props.chapter;
    console.log(chapter);
    return (
        <View style={styles.chapterContainer}>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>{chapter?.title}</Text>
                <View style={styles.chapterStatus}>
                    <Text>{getPublishedSate("PUBLISHED")}</Text>
                </View>
            </View>
            <View style={styles.chapterBottomRow}>
                <Text style={styles.chapterMaterialHeader}>Material</Text>
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
            {props.editMode && AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) && (
                <View style={styles.chapterEditRow}>
                    <MaterialCommunityIcons name="trash-can" size={28} color="white" style={styles.icon} />
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
        console.log(isPublished);
        if (isPublished === "UNPUBLISHED") {
            return (
                <>
                    <View style={styles.unpublishedCard}>
                        <View style={styles.circleUnpublished} />
                        <Text style={styles.textUnpublished}>{i18n.t("itrex.unpublished")}</Text>
                    </View>
                </>
            );
        } else if (isPublished === "PUBLISHED") {
            return (
                <>
                    <View style={styles.publishedCard}>
                        <View style={styles.circlePublished} />
                        <Text style={styles.textPublished}>{i18n.t("itrex.published")}</Text>
                    </View>
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
    textUnpublished: {
        color: dark.theme.pink,
        fontSize: 10,
    },
    circleUnpublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.pink,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.pink,
        marginRight: 3,
    },
    publishedCard: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderColor: dark.theme.lightGreen,
        borderWidth: 2,
        textShadowColor: dark.theme.lightGreen,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
    },
    textPublished: {
        color: dark.theme.lightGreen,
        fontSize: 10,
    },
    circlePublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightGreen,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightGreen,
        marginRight: 5,
    },
    unpublishedCard: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderColor: dark.theme.pink,
        borderWidth: 2,
        textShadowColor: dark.theme.pink,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
    },
    content: {
        flex: 1,
        margin: 15,
        color: "white",
        alignItems: "center",
    },
});
