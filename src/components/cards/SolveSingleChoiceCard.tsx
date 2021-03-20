/* eslint-disable complexity */
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { IQuestionSingleChoice } from "../../types/IQuestion";
import { LocalizationContext } from "../Context";
import { quizStyles } from "../screens/quizzes/quizStyles";
import { cardStyles } from "./cradStyles";

interface QuestionCardProps {
    question: IQuestionSingleChoice;
}

export const SolveSingleChoiceCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);

    const [singleAnswerZero, setSingleAnswerZero] = useState<boolean>(false);
    const [singleAnswerOne, setSingleAnswerOne] = useState<boolean>(false);
    const [singleAnswerTwo, setSingleAnswerTwo] = useState<boolean>(false);
    const [singleAnswerThree, setSingleAnswerThree] = useState<boolean>(false);

    const [solution, setSolution] = useState<string | undefined>();

    const question = props.question;
    return (
        <View style={cardStyles.card}>
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderQuestion()}</View>
        </View>
    );

    function renderQuestion() {
        return (
            <>
                <TouchableOpacity
                    disabled={singleAnswerZero}
                    style={singleAnswerZero ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    onPress={() => selectedSolution("0")}>
                    <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerOne ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    disabled={singleAnswerOne}
                    onPress={() => selectedSolution("1")}>
                    <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={singleAnswerTwo ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    disabled={singleAnswerTwo}
                    onPress={() => selectedSolution("2")}>
                    <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerThree ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    disabled={singleAnswerThree}
                    onPress={() => selectedSolution("3")}>
                    <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                </TouchableOpacity>
            </>
        );
    }

    function selectedSolution(index: string) {
        console.log(index);
        if (index === "0") {
            setSingleAnswerZero(true);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(false);
        } else if (index === "1") {
            setSingleAnswerZero(false);
            setSingleAnswerOne(true);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(false);
        } else if (index === "2") {
            setSingleAnswerZero(false);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(true);
            setSingleAnswerThree(false);
        } else if (index === "3") {
            setSingleAnswerZero(false);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(true);
        }

        setSolution(index);
    }
};
