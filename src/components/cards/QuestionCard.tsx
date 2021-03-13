/* eslint-disable complexity */
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { QuestionTypes } from "../../constants/QuestionTypes";
import { dark } from "../../constants/themes/dark";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { ISolutionNumeric } from "../../types/ISolution";
import { DataTable } from "react-native-paper";
import i18n from "../../locales";

interface QuestionCardProps {
    question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric;
}

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
    const { question } = props;

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{question.question}</Text>
            <View style={styles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderAnswers()}</View>
        </View>
    );

    function renderAnswers() {
        switch (question.type) {
            case QuestionTypes.SINGLE_CHOICE:
            case QuestionTypes.MULTIPLE_CHOICE:
                return (
                    <>
                        {question.solution === "0" || question.solution["0"] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        )}

                        {question.solution === "1" || question.solution[1] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        )}

                        {question.solution === "2" || question.solution[2] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        )}

                        {question.solution === "3" || question.solution[3] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[3]}</Text>
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
                                    <Text style={styles.textChoice}>{i18n.t("itrex.category")}</Text>
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    <Text style={styles.textChoice}>{i18n.t("itrex.value")}</Text>
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

const styles = StyleSheet.create({
    card: {
        shadowRadius: 10,
        shadowOffset: { width: -1, height: 1 },
        margin: 8,
        minWidth: "40%",
        marginRight: 20,
        backgroundColor: dark.Opacity.darkBlue1,
        textAlign: "center",
    },
    cardChoicesRight: {
        margin: 8,
        minHeight: 40,
        width: "40%",
        backgroundColor: dark.Opacity.darkGreen,
        borderColor: dark.theme.darkGreen,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
    },
    cardChoicesWrong: {
        minHeight: 40,
        margin: 8,
        width: "40%",
        backgroundColor: dark.Opacity.pink,
        borderColor: dark.theme.pink,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
    },
    cardHeader: {
        margin: 8,
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
        marginTop: 1,
    },
    textChoice: {
        color: "white",
        fontSize: 20,
    },
});
