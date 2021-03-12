import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import { TextButton } from "../../../uiElements/TextButton";
import { createAlert } from "../../../../helperScripts/createAlert";
import i18n from "../../../../locales";
import { IQuestionNumeric } from "../../../../types/IQuestion";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import * as NumericInput from "react-numeric-input";

interface QuizProps {
    question?: string;
}

export const NumericQuestion: React.FC<QuizProps> = (props) => {
    const questionText = props.question;
    console.log("--------------------------------------");
    console.log(questionText);

    React.useContext(LocalizationContext);

    const [numberSolution, setNumberSolution] = useState<number | null>(5);
    const [epsilonSolution, setEpsilonSolution] = useState<number | null>(0.1);

    useFocusEffect(
        React.useCallback(() => {
            console.log(questionText);
            // AuthenticationService.getInstance().getUserInfo(setUserInfo);
        }, [numberSolution, questionText])
    );

    return (
        <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 100 }}>
                <View style={styles.contentContainer}>
                    <Text style={styles.textStyle}>Specify the numeric answer right here: </Text>
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
                    <Text style={styles.textStyle}>Specify the epsilon value right here: </Text>
                    <NumericInput
                        step={0.1}
                        precision={2}
                        onChange={(number) => setEpsilonSolution(number)}
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
                <View style={{ marginTop: 150, alignSelf: "center" }}>
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveNumericQuestion()} />
                </View>
            </View>
        </>
    );

    function setNumberOfSolution(solutionNumber: number | null) {
        setNumberSolution(solutionNumber);
    }

    function saveNumericQuestion() {
        createAlert("Save Question, Navigate back to Add-Quiz page and add this question to the list of questions ");

        if (epsilonSolution === null || numberSolution === null || questionText === undefined) {
            return;
        }
        const myNewQuestion: IQuestionNumeric = {
            type: QuestionTypes.NUMERIC,
            question: questionText,
            solution: {
                epsilon: epsilonSolution,
                result: numberSolution,
            },
        };
        console.log(myNewQuestion);
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
