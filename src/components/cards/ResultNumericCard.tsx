/* eslint-disable complexity */
import React from "react";
import { View, Text } from "react-native";
import { IQuestionNumeric } from "../../types/IQuestion";
import { DataTable } from "react-native-paper";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";
import { cardStyles } from "./cardStyles";
import { color } from "react-native-reanimated";

interface QuestionCardProps {
    question: IQuestionNumeric;
}

export const ResultNumericCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const question = props.question;

    return (
        <View style={cardStyles.card}>
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {renderAnswers(question)}
            </View>
        </View>
    );

    function renderAnswers(question: IQuestionNumeric) {
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
                        <DataTable.Title numeric>
                            <Text style={cardStyles.textChoice}>Your solution:</Text>
                        </DataTable.Title>
                    </DataTable.Header>

                    <DataTable.Row>
                        <DataTable.Cell>
                            <Text style={{ color: "white" }}>{i18n.t("itrex.result")}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <Text style={{ color: "white" }}>{question.solution.result}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <Text
                                style={
                                    isResultCorrect(question)
                                        ? cardStyles.cardChoiceNumericRight
                                        : cardStyles.cardChoiceNumericWrong
                                }>
                                {question.userInput ? question.userInput : "-"}
                            </Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>
        );
    }
};

export function isResultCorrect(question: IQuestionNumeric): boolean {
    const correctSolution = question.solution.result;
    const acceptableEpsilon = question.solution.epsilon;
    const userInput = question.userInput;

    if (userInput === undefined) {
        return false;
    }
    if (userInput <= correctSolution + acceptableEpsilon && userInput >= correctSolution - acceptableEpsilon) {
        return true;
    }
    return false;
}
