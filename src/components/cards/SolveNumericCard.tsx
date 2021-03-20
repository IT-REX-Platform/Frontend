import React from "react";
import { View, Text } from "react-native";
import { DataTable } from "react-native-paper";
import NumericInput from "react-numeric-input";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { IQuestionNumeric } from "../../types/IQuestion";
import { LocalizationContext } from "../Context";
import { cardStyles } from "./cradStyles";

interface QuestionCardProps {
    question: IQuestionNumeric;
    onSolutionClicked: (question: IQuestionNumeric | undefined) => void;
}

export const SolveNumericCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);

    const { question, onSolutionClicked } = props;

    return (
        <View style={cardStyles.card}>
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderQuestion()}</View>
        </View>
    );

    function renderQuestion() {
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
                            <NumericInput
                                step={0.1}
                                precision={2}
                                onChange={(number) => setSolution(number)}
                                style={{
                                    input: {
                                        color: "white",
                                        background: dark.Opacity.darkBlue1,
                                        borderColor: dark.Opacity.darkBlue1,
                                        borderBlockColor: dark.Opacity.darkBlue1,
                                    },
                                }}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>
        );
    }

    function setSolution(solution: number | null) {
        if (solution !== null) {
            onSolutionClicked({ ...question, userInput: solution });
        }
    }
};
