/* eslint-disable complexity */
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import { TextButton } from "../../../uiElements/TextButton";
import i18n from "../../../../locales";
import { IChoices } from "../../../../types/IChoices";
import { validateMultipleChoiceQuestion } from "../../../../helperScripts/validateQuestions";
import { ISolutionMultipleChoice } from "../../../../types/ISolution";
import { toast } from "react-toastify";
import { IQuiz } from "../../../../types/IQuiz";
import Checkbox from "expo-checkbox";
import { ScreenCourseTabsNavigationProp } from "../../course/ScreenCourseTabs";

interface QuizProps {
    question?: string;
    quiz?: IQuiz;
}

export const MultipleChoiceQuestion: React.FC<QuizProps> = (props) => {
    const questionText = props.question;
    const quiz = props.quiz;

    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const [choicesMultipleChoice, setchoicesMultipleChoice] = useState<IChoices>();

    // Checkbox states to define the correct solution
    const [checkboxZero, setcheckboxZero] = useState(true);
    const [checkboxOne, setcheckboxOne] = useState(false);
    const [checkboxTwo, setcheckboxTwo] = useState(false);
    const [checkboxThree, setcheckboxThree] = useState(true);

    const [solution, setSolution] = useState<ISolutionMultipleChoice>({ "0": true, "1": false, "2": false, "3": true });

    useFocusEffect(
        React.useCallback(() => {
            // AuthenticationService.getInstance().getUserInfo(setUserInfo);
            setSolution({ "0": checkboxZero, "1": checkboxOne, "2": checkboxTwo, "3": checkboxThree });
        }, [choicesMultipleChoice, checkboxZero, checkboxOne, checkboxTwo, checkboxThree])
    );

    return (
        <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 90 }}>
                <Text style={styles.textStyle}>{i18n.t("itrex.specifyChoices")}</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        color={checkboxZero ? dark.theme.darkGreen : dark.theme.pink}
                        value={checkboxZero}
                        onValueChange={setcheckboxZero}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            style={[styles.answerInput]}
                            onChangeText={(text: string) => addSolutionEntry("0", text)}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        color={checkboxOne ? dark.theme.darkGreen : dark.theme.pink}
                        value={checkboxOne}
                        onValueChange={setcheckboxOne}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            style={[styles.answerInput]}
                            onChangeText={(text: string) => addSolutionEntry("1", text)}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        color={checkboxTwo ? dark.theme.darkGreen : dark.theme.pink}
                        value={checkboxTwo}
                        onValueChange={setcheckboxTwo}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            style={[styles.answerInput]}
                            onChangeText={(text: string) => addSolutionEntry("2", text)}
                            multiline={true}
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        color={checkboxThree ? dark.theme.darkGreen : dark.theme.pink}
                        value={checkboxThree}
                        onValueChange={setcheckboxThree}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            allowFontScaling={true}
                            style={[styles.answerInput]}
                            onChangeText={(text: string) => addSolutionEntry("3", text)}
                            multiline={true}
                        />
                    </View>
                </View>
            </View>
            <View>
                <View style={{ marginTop: 5, alignSelf: "center" }}>
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveMultipleChoiceQuestion()} />
                </View>
            </View>
        </>
    );

    function addSolutionEntry(index: string, text: string) {
        setchoicesMultipleChoice((choicesMultipleChoice) => ({ ...choicesMultipleChoice, [index]: text }));
    }

    function saveMultipleChoiceQuestion() {
        //createAlert("Save Question, Navigate back to Add-Quiz page and add this question to the list of questions ");
        // TODO: Save Question, Navigate back, show this question in add Quiz View
        // TODO: Verify if use added an other question text & answers & solutions & selected a answer type
        // TODO: confirm save
        if (validateMultipleChoiceQuestion(questionText, choicesMultipleChoice, solution)) {
            const myNewQuestion = validateMultipleChoiceQuestion(questionText, choicesMultipleChoice, solution);
            if (myNewQuestion === undefined || quiz === undefined) {
                return;
            }
            quiz?.questions.push(myNewQuestion);
            navigation.navigate("CREATE_QUIZ", { quiz: quiz });
            toast.success("Jetzt nur noch speichern");
        }
    }
};

const styles = StyleSheet.create({
    cardChoicesRight: {
        margin: 8,
        minHeight: 100,
        maxHeight: 150,
        width: "90%",
        backgroundColor: dark.Opacity.grey,
        borderColor: dark.theme.lightBlue,
        borderWidth: 5,
        justifyContent: "center",
        color: "white",
    },
    answerInput: {
        width: "100%",
        minHeight: 90,
        fontSize: 25,
        color: "white",
        borderColor: "white",
        borderStyle: "dotted",
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
    },
    card: {
        marginTop: 20,
        maxWidth: "50%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: dark.Opacity.grey,
    },

    textStyle: {
        color: "white",
        fontSize: 18,
    },
    section: {
        margin: 8,
        marginBottom: 0,
        minHeight: 120,
        maxHeight: 150,
        width: "45%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    checkbox: {
        margin: 8,
        width: 40,
        height: 40,
        backgroundColor: dark.theme.pink,
        borderRadius: 3,
    },
});
