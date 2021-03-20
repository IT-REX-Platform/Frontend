/* eslint-disable complexity */
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { QuestionTypes } from "../../constants/QuestionTypes";
import { dark } from "../../constants/themes/dark";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { ISolutionNumeric } from "../../types/ISolution";
import { DataTable } from "react-native-paper";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";
import { useNavigation } from "@react-navigation/native";
import { IQuiz } from "../../types/IQuiz";
import { cardStyles } from "./cardStyles";

interface QuestionCardProps {
    question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric;
    quiz: IQuiz;
    courseId: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();
    const question = props.question;
    const quiz = props.quiz;
    const courseId = props.courseId;

    return (
        <TouchableOpacity
            style={cardStyles.card}
            onPress={() =>
                navigation.navigate("CREATE_QUESTION", { courseId: courseId, quiz: quiz, question: question })
            }>
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderAnswers()}</View>
        </TouchableOpacity>
    );

    function renderAnswers() {
        switch (question.type) {
            case QuestionTypes.SINGLE_CHOICE:
                return (
                    <>
                        {question.solution === "0" ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        )}

                        {question.solution === "1" ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        )}

                        {question.solution === "2" ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        )}

                        {question.solution === "3" ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        )}
                    </>
                );
            case QuestionTypes.MULTIPLE_CHOICE:
                return (
                    <>
                        {question.solution[0] === true ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        )}

                        {question.solution[1] === true ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        )}

                        {question.solution[2] === true ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        )}

                        {question.solution[3] === true ? (
                            <View style={cardStyles.cardChoicesRight}>
                                <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        ) : (
                            <View style={cardStyles.cardChoicesWrong}>
                                <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        )}
                    </>
                );
            case QuestionTypes.NUMERIC:
                // eslint-disable-next-line no-case-declarations
                const solution: ISolutionNumeric = question.solution;
                return (
                    <View style={{ borderColor: "white", width: "50%" }}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>
                                    <Text style={cardStyles.textChoice}>{i18n.t("itrex.category")}</Text>
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    <Text style={cardStyles.textChoice}>{i18n.t("itrex.value")}</Text>
                                </DataTable.Title>
                            </DataTable.Header>

                            <DataTable.Row>
                                <DataTable.Cell>
                                    <Text style={{ color: "white" }}>{i18n.t("itrex.result")}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={{ color: "white" }}>{solution.result}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>

                            <DataTable.Row>
                                <DataTable.Cell>
                                    <Text style={{ color: "white" }}>{i18n.t("itrex.epsilon")}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={{ color: "white" }}>{solution.epsilon}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </View>
                );
            default:
                return <></>;
        }
    }
};
