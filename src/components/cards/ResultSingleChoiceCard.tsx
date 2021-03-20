/* eslint-disable complexity */
import React from "react";
import { View, Text } from "react-native";
import { IQuestionSingleChoice } from "../../types/IQuestion";
import { LocalizationContext } from "../Context";
import { cardStyles } from "./cardStyles";

interface ResultSingleChoiceCardProps {
    question: IQuestionSingleChoice;
}

export const ResultSingleChoiceCard: React.FC<ResultSingleChoiceCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const question: IQuestionSingleChoice = props.question;

    return (
        <View style={cardStyles.card}>
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderAnswers()}</View>
        </View>
    );

    function renderAnswers() {
        return (
            <>
                {/* First Question */}
                <View
                    style={question.solution === question.userInput ? cardStyles.cardChoicesResultSelected : undefined}>
                    {renderAnswer(question, "0")}
                </View>
                {/* Second Question */}
                <View
                    style={question.solution === question.userInput ? cardStyles.cardChoicesResultSelected : undefined}>
                    {renderAnswer(question, "1")}
                </View>

                {/* Third Question */}
                <View
                    style={question.solution === question.userInput ? cardStyles.cardChoicesResultSelected : undefined}>
                    {renderAnswer(question, "2")}
                </View>
                {/* Fourth Question */}
                <View
                    style={question.solution === question.userInput ? cardStyles.cardChoicesResultSelected : undefined}>
                    {renderAnswer(question, "3")}
                </View>
            </>
        );
    }

    function renderAnswer(question: IQuestionSingleChoice, index: string) {
        return (
            <>
                {question.solution === index ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[Number(index)]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[Number(index)]}</Text>
                    </View>
                )}
            </>
        );
    }
};
