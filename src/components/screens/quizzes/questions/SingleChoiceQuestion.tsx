/* eslint-disable complexity */
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import { TextButton } from "../../../uiElements/TextButton";
import i18n from "../../../../locales";

import { IChoices } from "../../../../types/IChoices";
import { validateSingleChoiceQuestion } from "../../../../helperScripts/validateQuestions";
import { IQuiz } from "../../../../types/IQuiz";
import { ScreenCourseTabsNavigationProp } from "../../course/ScreenCourseTabs";
import Checkbox from "expo-checkbox";
import { EndpointsQuestion } from "../../../../api/endpoints/EndpointsQuestion";
import { RequestFactory } from "../../../../api/requests/RequestFactory";
import { IQuestionSingleChoice } from "../../../../types/IQuestion";
import { QuestionTypes } from "../../../../constants/QuestionTypes";

interface QuizProps {
    question?: IQuestionSingleChoice;
    questionText: string;
    quiz?: IQuiz;
    courseId?: string;
}

const endpointsQuestion: EndpointsQuestion = new EndpointsQuestion();
export const SingleChoiceQuestion: React.FC<QuizProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const question = props.question;
    const questionId = question?.id;
    console.log(questionId);
    const questionText = props.questionText;
    const quiz = props.quiz;
    const courseId = props.courseId;

    const [choicesSingleChoice, setChoicesSingleChoice] = useState<IChoices>();

    // Checkbox states to define the correct solution
    const [checkboxZero, setCheckboxZero] = useState(true);
    const [checkboxOne, setCheckboxOne] = useState(false);
    const [checkboxTwo, setCheckboxTwo] = useState(false);
    const [checkboxThree, setCheckboxThree] = useState(false);

    const [solution, setSolution] = useState<string>("0");

    useFocusEffect(
        React.useCallback(() => {
            if (question !== undefined) {
                setChoicesSingleChoice(question.choices);
                setSolution(question.solution);
                changeChecked(question.solution);
            }
        }, [])
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
                        onValueChange={() => changeChecked("0")}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesSingleChoice !== undefined ? choicesSingleChoice["0"] : ""}
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
                        onValueChange={() => changeChecked("1")}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesSingleChoice !== undefined ? choicesSingleChoice["1"] : ""}
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
                        onValueChange={() => changeChecked("2")}
                    />

                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesSingleChoice !== undefined ? choicesSingleChoice["2"] : ""}
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
                        onValueChange={() => changeChecked("3")}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesSingleChoice !== undefined ? choicesSingleChoice["3"] : ""}
                            allowFontScaling={true}
                            style={[styles.answerInput]}
                            onChangeText={(text: string) => addSolutionEntry("3", text)}
                            multiline={true}
                        />
                    </View>
                </View>
            </View>
            <View>
                <View style={{ marginTop: 5, alignSelf: "center", flexDirection: "row" }}>
                    {questionId !== undefined && (
                        <TextButton color="pink" title={i18n.t("itrex.delete")} onPress={() => deleteQuestion()} />
                    )}
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveSingleChoiceQuestion()} />
                </View>
            </View>
        </>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function changeChecked(index: string): void {
        if (index === "0") {
            setCheckboxZero(true);
            setCheckboxOne(false);
            setCheckboxTwo(false);
            setCheckboxThree(false);
            setSolution("0");
        } else if (index === "1") {
            setCheckboxZero(false);
            setCheckboxOne(true);
            setCheckboxTwo(false);
            setCheckboxThree(false);
            setSolution("1");
        } else if (index === "2") {
            setCheckboxZero(false);
            setCheckboxOne(false);
            setCheckboxTwo(true);
            setCheckboxThree(false);
            setSolution("2");
        } else if (index === "3") {
            setCheckboxZero(false);
            setCheckboxOne(false);
            setCheckboxTwo(false);
            setCheckboxThree(true);
            setSolution("3");
        }
    }

    function addSolutionEntry(index: string, text: string) {
        setChoicesSingleChoice((choicesSingleChoice) => ({ ...choicesSingleChoice, [index]: text }));
    }

    function saveSingleChoiceQuestion() {
        if (validateSingleChoiceQuestion(courseId, questionText, choicesSingleChoice, solution)) {
            const myNewQuestion = validateSingleChoiceQuestion(courseId, questionText, choicesSingleChoice, solution);
            if (myNewQuestion === undefined || quiz === undefined) {
                return;
            }
            if (questionId === undefined) {
                const request: RequestInit = RequestFactory.createPostRequestWithBody(myNewQuestion);
                const response = endpointsQuestion.createQuestion(
                    request,
                    i18n.t("itrex.saveQuestionSuccess"),
                    i18n.t("itrex.saveQuestionError")
                );
                response.then((question) => {
                    if (question === undefined) {
                        return;
                    }
                    quiz.questions.push(question);
                    console.log(question);
                    navigation.navigate("CREATE_QUIZ", { quiz: quiz });
                });
            } else {
                updateQuestion();
            }
        }
    }

    function updateQuestion() {
        if (quiz === undefined) {
            return;
        }

        if (validateSingleChoiceQuestion(courseId, questionText, choicesSingleChoice, solution)) {
            const index = quiz.questions.findIndex((questionToUpdate) => questionToUpdate.id === questionId);
            const question = quiz.questions[index];

            if (question.type !== QuestionTypes.SINGLE_CHOICE || choicesSingleChoice === undefined) {
                return;
            }

            question.question = questionText;
            question.solution = solution;
            question.choices = choicesSingleChoice;

            const request: RequestInit = RequestFactory.createPutRequest(question);
            endpointsQuestion
                .updateQuestion(request, i18n.t("itrex.updateQuestionSuccess"), i18n.t("itrex.updateQuestionError"))
                .then(function (question) {
                    console.log(question);
                    navigation.navigate("CREATE_QUIZ", { quiz: quiz });
                });
        }
    }

    function deleteQuestion() {
        if (quiz == undefined || questionId == undefined) {
            return;
        }

        const index = quiz.questions.findIndex((questionToUpdate) => questionToUpdate.id === questionId);

        const request: RequestInit = RequestFactory.createDeleteRequest();
        const response = endpointsQuestion.deleteQuestion(
            request,
            questionId,
            i18n.t("itrex.deleteQuestionSuccess"),
            i18n.t("itrex.deleteQuestionError")
        );
        response.then(() => {
            quiz.questions.splice(index, 1);
            navigation.navigate("CREATE_QUIZ", { quiz: quiz });
        });
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
