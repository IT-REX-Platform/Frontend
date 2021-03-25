/* eslint-disable complexity */
import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IQuestionMultipleChoice } from "../../types/IQuestion";
import { cardStyles } from "./cardStyles";

interface ResultMultipleChoiceCardProps {
    question: IQuestionMultipleChoice;
}

export const ResultMultipleChoiceCard: React.FC<ResultMultipleChoiceCardProps> = (props) => {
    const question: IQuestionMultipleChoice = props.question;

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
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {Object.entries(question.choices).map((choice) => {
                    const index: string = choice[0];
                    const value: string = choice[1];
                    return renderAnswer(question, index, value);
                })}
            </View>
        </View>
    );

    function renderAnswer(question: IQuestionMultipleChoice, index: string, value: string) {
        let selected = false;
        if (question.userInput) {
            if (question.userInput[index]) {
                selected = true;
            }
        }
        return (
            <View style={selected ? cardStyles.cardChoicesResultSelected : cardStyles.cardChoicesNotSelect}>
                <View
                    style={
                        question.solution[index] ? cardStyles.cardChoicesResultRight : cardStyles.cardChoicesResultWrong
                    }>
                    <Text style={cardStyles.textChoice}>{value}</Text>
                </View>
            </View>
        );
    }
};
