/* eslint-disable complexity */
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
import { IQuiz } from "../../../../types/IQuiz";
import { ScreenCourseTabsNavigationProp } from "../../course/ScreenCourseTabs";
import { ToastService } from "../../../../services/toasts/ToastService";
import { IQuestionNumeric } from "../../../../types/IQuestion";
import { RequestFactory } from "../../../../api/requests/RequestFactory";
import { EndpointsQuestion } from "../../../../api/endpoints/EndpointsQuestion";
import { QuestionTypes } from "../../../../constants/QuestionTypes";

interface QuizProps {
    question?: IQuestionNumeric;
    quiz?: IQuiz;
    questionText: string;
    courseId?: string;
}

const endpointsQuestion: EndpointsQuestion = new EndpointsQuestion();

export const NumericQuestion: React.FC<QuizProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const question = props.question;
    const questionId = question?.id;
    const questionText = props.questionText;
    const quiz = props.quiz;
    const courseId = props.courseId;

    const defaultSolution = question !== undefined ? question.solution.result : 0;
    const [numberSolution, setNumberSolution] = useState<number>(defaultSolution);

    const defaultEpsilon = question !== undefined ? question.solution.epsilon : 0;
    const [epsilonSolution, setEpsilonSolution] = useState<number>(defaultEpsilon);

    useFocusEffect(
        React.useCallback(() => {
            console.log(question);
        }, [numberSolution])
    );

    return (
        <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 100 }}>
                <View style={styles.contentContainer}>
                    <Text style={styles.textStyle}>{i18n.t("itrex.specifyNumericAnswer")} </Text>
                    <NumericInput
                        step={0.1}
                        precision={2}
                        defaultValue={defaultSolution}
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
                        defaultValue={defaultEpsilon}
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
                <View style={{ marginTop: 187, alignSelf: "center", flexDirection: "row" }}>
                    {questionId !== undefined && (
                        <TextButton color="pink" title={i18n.t("itrex.delete")} onPress={() => deleteQuestion()} />
                    )}
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
        if (validateNumericQuestion(courseId, questionText, epsilonSolution, numberSolution)) {
            const myNewQuestion = validateNumericQuestion(courseId, questionText, epsilonSolution, numberSolution);
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

        if (validateNumericQuestion(courseId, questionText, epsilonSolution, numberSolution)) {
            const index = quiz.questions.findIndex((questionToUpdate) => questionToUpdate.id === questionId);
            const question = quiz.questions[index];

            if (question.type !== QuestionTypes.NUMERIC) {
                return;
            }

            question.question = questionText;
            question.solution.result = numberSolution;
            question.solution.epsilon = epsilonSolution;

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
