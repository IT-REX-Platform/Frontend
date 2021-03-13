import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import { TextButton } from "../../../uiElements/TextButton";
import { createAlert } from "../../../../helperScripts/createAlert";
import i18n from "../../../../locales";
import * as NumericInput from "react-numeric-input";
import { validateNumericQuestion } from "../../../../helperScripts/validateQuestions";
import { toast } from "react-toastify";
import { IQuiz } from "../../../../types/IQuiz";
import { ScreenCourseTabsNavigationProp } from "../../course/ScreenCourseTabs";

interface QuizProps {
    question: string | undefined;
    quiz?: IQuiz;
}

export const NumericQuestion: React.FC<QuizProps> = (props) => {
    const questionText = props.question;
    const quiz = props.quiz;

    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const [numberSolution, setNumberSolution] = useState<number>();
    const [epsilonSolution, setEpsilonSolution] = useState<number>();

    useFocusEffect(
        React.useCallback(() => {
            console.log(questionText);
        }, [numberSolution, questionText])
    );

    return (
        <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 100 }}>
                <View style={styles.contentContainer}>
                    <Text style={styles.textStyle}>{i18n.t("itrex.specifyNumericAnswer")} </Text>
                    <NumericInput
                        step={0.1}
                        precision={2}
                        onChange={(number) => setNumberOfSolution(number)}
                        style={{
                            input: {
                                color: "white",
                                background: dark.Opacity.darkBlue1,
                                borderColor: dark.Opacity.darkBlue1,
                                borderBlockColor: dark.Opacity.darkBlue1,
                            },
                        }}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.textStyle}>{i18n.t("itrex.specifyNumericEpsilon")}</Text>
                    <NumericInput
                        step={0.1}
                        precision={2}
                        onChange={(number) => setNumberOfEpsilon(number)}
                        style={{
                            input: {
                                color: "white",
                                background: dark.Opacity.darkBlue1,
                                borderColor: dark.Opacity.darkBlue1,
                                borderBlockColor: dark.Opacity.darkBlue1,
                            },
                        }}
                    />
                </View>
            </View>
            <View>
                <View style={{ marginTop: 187, alignSelf: "center" }}>
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveNumericQuestion()} />
                </View>
            </View>
        </>
    );

    function setNumberOfEpsilon(solutionEpsilon: number | null) {
        if (solutionEpsilon === null) {
            return;
        }
        setEpsilonSolution(solutionEpsilon);
    }

    function setNumberOfSolution(solutionNumber: number | null) {
        if (solutionNumber === null) {
            return;
        }
        setNumberSolution(solutionNumber);
    }

    function saveNumericQuestion() {
        createAlert("Save Question, Navigate back to Add-Quiz page and add this question to the list of questions ");

        if (validateNumericQuestion(questionText, epsilonSolution, numberSolution)) {
            const myNewQuestion = validateNumericQuestion(questionText, epsilonSolution, numberSolution);
            //TODO: ENPOINT REQUEST TO SAVE QUESTION

            if (myNewQuestion === undefined || quiz === undefined) {
                return;
            }
            quiz.questions.push(myNewQuestion);

            toast.success("Jetzt noch speichern!");
            navigation.navigate("CREATE_QUIZ", { quiz: quiz });
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
    separator: {
        marginBottom: 20,
    },
    card: {
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
    contentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "80%",
        marginTop: 20,
    },
});
