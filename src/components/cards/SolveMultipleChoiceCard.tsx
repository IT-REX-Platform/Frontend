/* eslint-disable complexity */
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IQuestionMultipleChoice } from "../../types/IQuestion";
import { ISolutionMultipleChoice } from "../../types/ISolution";
import { LocalizationContext } from "../Context";
import { cardStyles } from "./cardStyles";

interface QuestionCardProps {
    question: IQuestionMultipleChoice;
    onSolutionClicked: (question: IQuestionMultipleChoice | undefined) => void;
}

export const SolveMultipleChoiceCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);

    const { question, onSolutionClicked } = props;

    const [singleAnswerZero, setSingleAnswerZero] = useState<boolean>(false);
    const [singleAnswerOne, setSingleAnswerOne] = useState<boolean>(false);
    const [singleAnswerTwo, setSingleAnswerTwo] = useState<boolean>(false);
    const [singleAnswerThree, setSingleAnswerThree] = useState<boolean>(false);

    useEffect(() => {
        const solutionObj: ISolutionMultipleChoice = {
            "0": singleAnswerZero,
            "1": singleAnswerOne,
            "2": singleAnswerTwo,
            "3": singleAnswerThree,
        };
        onSolutionClicked({ ...question, userInput: solutionObj });
    }, [singleAnswerZero, singleAnswerOne, singleAnswerTwo, singleAnswerThree]);

    return (
        <View style={cardStyles.card}>
            <MaterialCommunityIcons
                name="check-all"
                color="white"
                size={26}
                style={{ position: "absolute", margin: 8 }}
            />
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderQuestion()}</View>
        </View>
    );

    function renderQuestion() {
        return (
            <>
                <TouchableOpacity
                    style={singleAnswerZero ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    onPress={() => {
                        console.log(!singleAnswerZero);
                        setSingleAnswerZero(!singleAnswerZero);
                    }}>
                    <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerOne ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    onPress={() => setSingleAnswerOne(!singleAnswerOne)}>
                    <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={singleAnswerTwo ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    onPress={() => setSingleAnswerTwo(!singleAnswerTwo)}>
                    <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={singleAnswerThree ? cardStyles.cardChoicesRight : cardStyles.cardChoicesSelect}
                    onPress={() => setSingleAnswerThree(!singleAnswerThree)}>
                    <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                </TouchableOpacity>
            </>
        );
    }
};
