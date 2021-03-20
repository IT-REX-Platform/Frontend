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
        console.log(question.solution + " " + question.userInput);
        return (
            <>
                {/* First Question */}
                <View
                    style={
                        "0" === question.userInput
                            ? cardStyles.cardChoicesResultSelected
                            : cardStyles.cardChoicesNotSelect
                    }>
                    {renderAnswer(question, "0")}
                </View>
                {/* Second Question */}
                <View
                    style={
                        "1" === question.userInput
                            ? cardStyles.cardChoicesResultSelected
                            : cardStyles.cardChoicesNotSelect
                    }>
                    {renderAnswer(question, "1")}
                </View>

                {/* Third Question */}
                <View
                    style={
                        "2" === question.userInput
                            ? cardStyles.cardChoicesResultSelected
                            : cardStyles.cardChoicesNotSelect
                    }>
                    {renderAnswer(question, "2")}
                </View>
                {/* Fourth Question */}
                <View
                    style={
                        "3" === question.userInput
                            ? cardStyles.cardChoicesResultSelected
                            : cardStyles.cardChoicesNotSelect
                    }>
                    {renderAnswer(question, "3")}
                </View>
            </>
        );
    }

    function renderAnswer(question: IQuestionSingleChoice, index: string) {
        return (
            <>
                <View
                    style={
                        question.solution === index
                            ? cardStyles.cardChoicesResultRight
                            : cardStyles.cardChoicesResultWrong
                    }>
                    <Text style={cardStyles.textChoice}>{question.choices[Number(index)]}</Text>
                </View>
            </>
        );
    }
};
