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
import { IQuiz } from "../../../../types/IQuiz";
import Checkbox from "expo-checkbox";
import { ScreenCourseTabsNavigationProp } from "../../course/ScreenCourseTabs";
import { IQuestionMultipleChoice } from "../../../../types/IQuestion";
import { EndpointsQuestion } from "../../../../api/endpoints/EndpointsQuestion";
import { RequestFactory } from "../../../../api/requests/RequestFactory";
import { QuestionTypes } from "../../../../constants/QuestionTypes";

interface QuizProps {
    question?: IQuestionMultipleChoice;
    questionText: string;
    quiz?: IQuiz;
    courseId?: string;
}

const endpointsQuestion: EndpointsQuestion = new EndpointsQuestion();
export const MultipleChoiceQuestion: React.FC<QuizProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const question = props.question;
    const questionId = question?.id;
    const questionText = props.questionText;
    const quiz = props.quiz;
    const courseId = props.courseId;

    const defaultChoices = question !== undefined ? question.choices : { "0": "", "1": "", "2": "", "3": "" };
    const [choicesMultipleChoice, setchoicesMultipleChoice] = useState<IChoices>(defaultChoices);

    // Default Checkbox values
    const defaultCheckboxZero = question !== undefined ? question.solution["0"] : true;
    const defaultCheckboxOne = question !== undefined ? question.solution["1"] : false;
    const defaultCheckboxTwo = question !== undefined ? question.solution["2"] : false;
    const defaultCheckboxThree = question !== undefined ? question.solution["3"] : true;

    // Checkbox states to define the correct solution
    const [checkboxZero, setCheckboxZero] = useState<boolean>(defaultCheckboxZero);
    const [checkboxOne, setCheckboxOne] = useState<boolean>(defaultCheckboxOne);
    const [checkboxTwo, setCheckboxTwo] = useState<boolean>(defaultCheckboxTwo);
    const [checkboxThree, setCheckboxThree] = useState<boolean>(defaultCheckboxThree);

    const defaultSolution =
        question !== undefined ? question.solution : { "0": true, "1": false, "2": false, "3": true };
    const [solution, setSolution] = useState<ISolutionMultipleChoice>(defaultSolution);

    useFocusEffect(
        React.useCallback(() => {
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
                        onValueChange={setCheckboxZero}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesMultipleChoice !== undefined ? choicesMultipleChoice["0"] : ""}
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
                        onValueChange={setCheckboxOne}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesMultipleChoice !== undefined ? choicesMultipleChoice["1"] : ""}
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
                        onValueChange={setCheckboxTwo}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesMultipleChoice !== undefined ? choicesMultipleChoice["2"] : ""}
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
                        onValueChange={setCheckboxThree}
                    />
                    <View style={styles.cardChoicesRight}>
                        <TextInput
                            editable
                            defaultValue={choicesMultipleChoice !== undefined ? choicesMultipleChoice["3"] : ""}
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
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveMultipleChoiceQuestion()} />
                </View>
            </View>
        </>
    );

    function addSolutionEntry(index: string, text: string) {
        setchoicesMultipleChoice((choicesMultipleChoice) => ({ ...choicesMultipleChoice, [index]: text }));
    }

    function saveMultipleChoiceQuestion() {
        setSolution({ "0": checkboxZero, "1": checkboxOne, "2": checkboxTwo, "3": checkboxThree });
        if (validateMultipleChoiceQuestion(courseId, questionText, choicesMultipleChoice, solution)) {
            const myNewQuestion = validateMultipleChoiceQuestion(
                courseId,
                questionText,
                choicesMultipleChoice,
                solution
            );
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

        if (validateMultipleChoiceQuestion(courseId, questionText, choicesMultipleChoice, solution)) {
            const index = quiz.questions.findIndex((questionToUpdate) => questionToUpdate.id === questionId);
            const question = quiz.questions[index];

            if (question.type !== QuestionTypes.MULTIPLE_CHOICE || choicesMultipleChoice === undefined) {
                return;
            }

            question.question = questionText;
            question.solution = solution;
            question.choices = choicesMultipleChoice;

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
