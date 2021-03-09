import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { LocalizationContext } from "../../Context";
import AuthenticationService from "../../../services/AuthenticationService";
import { IUser } from "../../../types/IUser";
import { IChapter } from "../../../types/IChapter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextButton } from "../../uiElements/TextButton";
import { createAlert } from "../../../helperScripts/createAlert";
import i18n from "../../../locales";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
}

export const ScreenAddQuestion: React.FC<ChapterComponentProps> = () => {
    React.useContext(LocalizationContext);
    const [user, setUserInfo] = useState<IUser>({});
    const [question, setQuestion] = useState<
        Array<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
    >();
    const [questionText, setQuestionText] = useState<string | undefined>("Please add your question here.");

    useFocusEffect(
        React.useCallback(() => {
            AuthenticationService.getInstance().getUserInfo(setUserInfo);
        }, [])
    );

    return (
        <View style={styles.rootContainer}>
            <ImageBackground source={require("../../../constants/images/Background1-1.png")} style={styles.image}>
                <View style={[styles.headContainer]}>
                    <View style={styles.borderContainer}>
                        <TextInput
                            style={styles.quizHeader}
                            value={questionText}
                            onChangeText={(text) => setQuestionText(text)}
                        />
                        <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                    </View>
                    <View>
                        <TextButton title={i18n.t("itrex.save")} onPress={() => createAlert("save Quiz")} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    headContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingTop: "3%",
        paddingLeft: "3%",
    },
    borderContainer: {
        flex: 3,
        flexDirection: "row",
        borderBottomColor: "rgba(70,74,91,0.5)",
        borderBottomWidth: 3,
    },
    quizHeader: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },

    rootContainer: {
        paddingTop: "3%",
        flex: 4,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: dark.theme.darkBlue1,
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
});
