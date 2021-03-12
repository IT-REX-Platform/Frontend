import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import { TextButton } from "../../../uiElements/TextButton";
import { createAlert } from "../../../../helperScripts/createAlert";
import i18n from "../../../../locales";
import { IChoices } from "../../../../types/IChoices";
import { validateMultipleChoiceQuestion } from "../../../../helperScripts/validateQuestions";
import { ISolutionMultipleChoice } from "../../../../types/ISolution";
import { toast } from "react-toastify";
import { IQuiz } from "../../../../types/IQuiz";

interface QuizProps {
    question?: string;
    quiz?: IQuiz;
}

export const MultipleChoiceQuestion: React.FC<QuizProps> = (props) => {
    const questionText = props.question;
    console.log("--------------------------------------");
    console.log(questionText);

    React.useContext(LocalizationContext);

    const [choicesMultipleChoice, setchoicesMultipleChoice] = useState<IChoices>();

    useFocusEffect(
        React.useCallback(() => {
            // AuthenticationService.getInstance().getUserInfo(setUserInfo);
        }, [choicesMultipleChoice])
    );

    return (
        <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 90 }}>
                <Text style={styles.textStyle}>{i18n.t("itrex.specifyChoices")}</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        onChangeText={(text: string) => addSolutionEntry("3", text)}
                        multiline={true}
                    />
                </View>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        onChangeText={(text: string) => addSolutionEntry("3", text)}
                        multiline={true}
                    />
                </View>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        style={[styles.descriptionInput, styles.separator]}
                        onChangeText={(text: string) => addSolutionEntry("3", text)}
                        multiline={true}
                    />
                </View>
                <View style={styles.cardChoicesRight}>
                    <TextInput
                        editable
                        allowFontScaling={true}
                        style={[styles.descriptionInput, styles.separator]}
                        onChangeText={(text: string) => addSolutionEntry("3", text)}
                        multiline={true}
                    />
                </View>
            </View>
            <View>
                <View style={{ marginTop: 20, alignSelf: "center" }}>
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveMultipleChoiceQuestion()} />
                </View>
            </View>
        </>
    );

    function addSolutionEntry(index: string, text: string) {
        setchoicesMultipleChoice((choicesMultipleChoice) => ({ ...choicesMultipleChoice, [index]: text }));
    }

    function saveMultipleChoiceQuestion() {
        createAlert("Save Question, Navigate back to Add-Quiz page and add this question to the list of questions ");
        // TODO: Save Question, Navigate back, show this question in add Quiz View
        // TODO: Verify if use added an other question text & answers & solutions & selected a answer type
        // TODO: confirm save

        const solution: ISolutionMultipleChoice = { "0": true, "1": true, "2": false, "3": false };
        if (validateMultipleChoiceQuestion(questionText, choicesMultipleChoice, solution)) {
            const myNewQuestion = validateMultipleChoiceQuestion(questionText, choicesMultipleChoice, solution);
            toast.success("Jetzt nur noch speichern");
            console.log(myNewQuestion);
        }
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
        height: 100,
        flex: 3,
        flexDirection: "row",
        borderBottomColor: "rgba(70,74,91,0.5)",
        borderBottomWidth: 3,
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
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
        borderColor: dark.theme.lightBlue,
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
        borderStyle: "dotted",
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
    },
    questionInput: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
        height: "90%",
        margin: 2,
        padding: 5,
        borderColor: "white",
        borderStyle: "dotted",
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
    },
    separator: {
        marginBottom: 20,
    },
    card: {
        marginTop: 20,
        maxWidth: "50%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: dark.Opacity.grey,
    },
    cardHeader: {
        padding: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        flexGrow: 1,
    },
    filterContainer: {
        flexGrow: 4,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    textStyle: {
        color: "white",
        fontSize: 18,
    },
});
