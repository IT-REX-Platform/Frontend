/* eslint-disable complexity */
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IQuestionSingleChoice } from "../../../types/IQuestion";
import { LocalizationContext } from "../../Context";
import { cardStyles } from "../cardStyles";

interface QuestionCardProps {
    question: IQuestionSingleChoice;
    onSolutionClicked: (question: IQuestionSingleChoice | undefined) => void;
}

export const SolveSingleChoiceCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);

    const { question, onSolutionClicked } = props;

    const [singleAnswerZero, setSingleAnswerZero] = useState<boolean>(false);
    const [singleAnswerOne, setSingleAnswerOne] = useState<boolean>(false);
    const [singleAnswerTwo, setSingleAnswerTwo] = useState<boolean>(false);
    const [singleAnswerThree, setSingleAnswerThree] = useState<boolean>(false);

    return (
        <View style={cardStyles.card}>
            <MaterialCommunityIcons name="check" color="white" size={26} style={{ position: "absolute", margin: 8 }} />
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
                    style={singleAnswerZero ? cardStyles.cardChoicesResultSelected : cardStyles.cardChoicesSelect}
                    onPress={() => selectedSolution(0)}>
                    <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerOne ? cardStyles.cardChoicesResultSelected : cardStyles.cardChoicesSelect}
                    disabled={singleAnswerOne}
                    onPress={() => selectedSolution(1)}>
                    <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={singleAnswerTwo ? cardStyles.cardChoicesResultSelected : cardStyles.cardChoicesSelect}
                    disabled={singleAnswerTwo}
                    onPress={() => selectedSolution(2)}>
                    <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerThree ? cardStyles.cardChoicesResultSelected : cardStyles.cardChoicesSelect}
                    disabled={singleAnswerThree}
                    onPress={() => selectedSolution(3)}>
                    <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                </TouchableOpacity>
            </>
        );
    }

    function selectedSolution(index: number) {
        if (index === 0) {
            setSingleAnswerZero(true);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(false);
        } else if (index === 1) {
            setSingleAnswerZero(false);
            setSingleAnswerOne(true);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(false);
        } else if (index === 2) {
            setSingleAnswerZero(false);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(true);
            setSingleAnswerThree(false);
        } else if (index === 3) {
            setSingleAnswerZero(false);
            setSingleAnswerOne(false);
            setSingleAnswerTwo(false);
            setSingleAnswerThree(true);
        }

        onSolutionClicked({ ...question, userInput: index });
    }
};
