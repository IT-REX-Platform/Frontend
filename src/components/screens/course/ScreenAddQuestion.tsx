import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, TextInput, Text } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { LocalizationContext } from "../../Context";
import { IChapter } from "../../../types/IChapter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextButton } from "../../uiElements/TextButton";
import { createAlert } from "../../../helperScripts/createAlert";
import i18n from "../../../locales";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";
import { IUser } from "../../../types/IUser";
import { create } from "react-test-renderer";

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
            // AuthenticationService.getInstance().getUserInfo(setUserInfo);
        }, [])
    );

    return (
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
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveQuestion()} />
                </View>
            </View>
            <View>
                <Text style={{ color: "white", marginLeft: 30 }}>
                    Selection: Single Choice / Multiple Choice / Numeric Answer (Dropdown? Add Solution Possibility
                    regading to the Question/Answer Type )
                </Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        value={"Answer"}
                        onChangeText={(text: string) => addChoice(text)}
                        multiline={true}
                    />
                </View>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        value={"Answer"}
                        onChangeText={(text: string) => addChoice(text)}
                        multiline={true}
                    />
                </View>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        value={"Answer"}
                        onChangeText={(text: string) => addChoice(text)}
                        multiline={true}
                    />
                </View>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        value={"Answer"}
                        onChangeText={(text: string) => addChoice(text)}
                        multiline={true}
                    />
                </View>
            </View>
        </ImageBackground>
    );

    function saveQuestion() {
        createAlert("Save Question, Navigate back to Add-Quiz page and add this question to the list of questions ");
        // TODO: Save Question, Navigate back, show this question in add Quiz View
        // TODO: Verify if use added an other question text & answers & solutions & selected a answer type
        // TODO: confirm save
    }

    function addChoice(answerText: string) {
        // Add question text to questions
    }
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
    cardChoicesRight: {
        margin: 8,
        minHeight: 100,
        maxHeight: 150,
        width: "40%",
        backgroundColor: dark.Opacity.grey,
        borderColor: dark.theme.darkGreen,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        color: "white",
    },
    descriptionInput: {
        width: "100%",
        height: "90%",
        margin: 2,
        padding: 5,
        fontSize: 16,
        color: "white",
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
    },
    separator: {
        marginBottom: 20,
    },
});
