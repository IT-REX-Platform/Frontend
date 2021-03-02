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
    return (
        <View style={styles.chapterContainer}>
            <View style={styles.chapterTopRow}>
                <Text style={styles.chapterHeader}>{chapter?.title}</Text>
                <Text style={styles.chapterStatus}>may Published </Text>
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
