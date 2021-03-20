/* eslint-disable complexity */
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IQuestionSingleChoice } from "../../types/IQuestion";
import { LocalizationContext } from "../Context";
import { quizStyles } from "../screens/quizzes/quizStyles";
import { cardStyles } from "./cradStyles";

interface QuestionCardProps {
    question: IQuestionSingleChoice;
}

export const SolveQuestionCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);

    const [singleAnswerZero, setSingleAnswerZero] = useState<boolean>();
    const [singleAnswerOne, setSingleAnswerOne] = useState<boolean>();
    const [singleAnswerTwo, setSingleAnswerTwo] = useState<boolean>();
    const [singleAnswerThree, setSingleAnswerThree] = useState<boolean>();

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
                    style={singleAnswerZero ? cardStyles.cardChoicesRight : quizStyles.answerInput}
                    onPress={() => setSelectedSolution("0")}>
                    <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerOne ? cardStyles.cardChoicesRight : quizStyles.answerInput}
                    disabled={singleAnswerOne}
                    onPress={() => setSelectedSolution("1")}>
                    <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={singleAnswerTwo ? cardStyles.cardChoicesRight : quizStyles.answerInput}
                    disabled={singleAnswerTwo}
                    onPress={() => setSelectedSolution("2")}>
                    <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerThree ? cardStyles.cardChoicesRight : quizStyles.answerInput}
                    disabled={singleAnswerThree}
                    onPress={() => setSelectedSolution("3")}>
                    <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                </TouchableOpacity>
            </>
        );
    }

    function setSelectedSolution(index: string) {
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
