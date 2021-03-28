/* eslint-disable complexity */
import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IQuestionSingleChoice } from "../../../types/IQuestion";
import { LocalizationContext } from "../../Context";
import { cardStyles } from "../cardStyles";
interface ResultSingleChoiceCardProps {
    question: IQuestionSingleChoice;
}

export const ResultSingleChoiceCard: React.FC<ResultSingleChoiceCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const question: IQuestionSingleChoice = props.question;

    return (
        <View style={cardStyles.card}>
            <MaterialCommunityIcons name="check" color="white" size={26} style={{ position: "absolute", margin: 8 }} />

            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {Object.entries(question.choices).map((choice) => {
                    const index: string = choice[0];
                    return renderAnswer(question, Number(index));
                })}
            </View>
        </View>
    );

    function renderAnswer(question: IQuestionSingleChoice, index: number) {
        let selected = false;
        if (question.userInput !== undefined) {
            // userInput = index of selected question
            if (question.userInput == index) {
                selected = true;
            }
        }
        return (
            <View style={selected ? cardStyles.cardChoicesResultSelected : cardStyles.cardChoicesNotSelect}>
                <View
                    style={
                        question.solution == index
                            ? cardStyles.cardChoicesResultRight
                            : cardStyles.cardChoicesResultWrong
                    }>
                    <Text style={cardStyles.textChoice}>{question.choices[Number(index)]}</Text>
                </View>
            </View>
        );
    }
};
