/* eslint-disable complexity */
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";
import { QuestionTypes } from "../../constants/QuestionTypes";
import i18n from "../../locales";
import { IQuestionSingleChoice, IQuestionMultipleChoice, IQuestionNumeric } from "../../types/IQuestion";
import { IQuiz } from "../../types/IQuiz";
import { ISolutionNumeric } from "../../types/ISolution";
import { LocalizationContext } from "../Context";
import { cardStyles } from "./cradStyles";

interface QuestionCardProps {
    question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric;
}

export const SolveQuestionCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);

    const [singleAnswerZero, setSingleAnswerZero] = useState<boolean>();
    const [singleAnswerOne, setSingleAnswerOne] = useState<boolean>();
    const [singleAnswerTwo, setSingleAnswerTwo] = useState<boolean>();
    const [singleAnswerThree, setSingleAnswerThree] = useState<boolean>();

    const question = props.question;
    return (
        <View style={cardStyles.card}>
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderAnswers()}</View>
        </View>
    );

    // eslint-disable-next-line complexity
    function renderAnswers() {
        switch (question.type) {
            case QuestionTypes.SINGLE_CHOICE:
                return (
                    <>
                        <TouchableOpacity
                            disabled={singleAnswerZero}
                            style={cardStyles.cardChoicesRight}
                            onPress={() => setSelectedSolution("0")}>
                            <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            disabled={singleAnswerOne}
                            onPress={() => setSelectedSolution("1")}>
                            <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            disabled={singleAnswerTwo}
                            onPress={() => setSelectedSolution("2")}>
                            <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            disabled={singleAnswerThree}
                            onPress={() => setSelectedSolution("3")}>
                            <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                        </TouchableOpacity>
                    </>
                );
            case QuestionTypes.MULTIPLE_CHOICE:
                return (
                    <>
                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            onPress={() => console.log("check if right")}>
                            <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            onPress={() => console.log("check if right")}>
                            <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            onPress={() => console.log("check if right")}>
                            <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={cardStyles.cardChoicesRight}
                            onPress={() => console.log("check if right")}>
                            <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                        </TouchableOpacity>
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

    function setSelectedSolution(index: string) {
        if (index === "0") {
            setSingleAnswerZero(true);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(false);
            //  setSolution("0");
        } else if (index === "1") {
            setSingleAnswerZero(false);
            setSingleAnswerOne(true);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(false);
            //  setSolution("0");
        } else if (index === "2") {
            setSingleAnswerZero(false);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(true);
            setSingleAnswerThree(false);
            //  setSolution("0");
        } else if (index === "3") {
            setSingleAnswerZero(false);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(true);
            //  setSolution("0");
        }
    }
};
