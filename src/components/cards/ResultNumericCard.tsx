import React from "react";
import { View, Text } from "react-native";
import { IQuestionNumeric } from "../../types/IQuestion";
import { DataTable } from "react-native-paper";
import i18n from "../../locales";
import { LocalizationContext } from "../Context";
import { cardStyles } from "./cardStyles";
import { isNumericResultCorrect } from "../../helperScripts/solveQuizHelpers";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface QuestionCardProps {
    question: IQuestionNumeric;
}

export const ResultNumericCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const question = props.question;

    return (
        <View style={cardStyles.card}>
            <MaterialCommunityIcons
                name="numeric"
                color="white"
                size={26}
                style={{ position: "absolute", margin: 8 }}
            />

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
                            <Text style={cardStyles.textChoice}>{i18n.t("itrex.quizNumericYourResult")}</Text>
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
                                    isNumericResultCorrect(question)
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
