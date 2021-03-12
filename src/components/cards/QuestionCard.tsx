/* eslint-disable complexity */
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { QuestionTypes } from "../../constants/QuestionTypes";
import { dark } from "../../constants/themes/dark";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";

interface QuestionCardProps {
    question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric;
}

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
    const { question } = props;

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{question.question}</Text>
            <View style={styles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderAnswers()}</View>
        </View>
    );

    function renderAnswers() {
        switch (question.type) {
            case QuestionTypes.SINGLE_CHOICE:
            case QuestionTypes.MULTIPLE_CHOICE:
                return (
                    <>
                        {question.solution === "0" || question.solution[0] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[0]}</Text>
                            </View>
                        )}

                        {question.solution === "1" || question.solution[1] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[1]}</Text>
                            </View>
                        )}

                        {question.solution === "2" || question.solution[2] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[2]}</Text>
                            </View>
                        )}

                        {question.solution === "3" || question.solution[3] === true ? (
                            <View style={styles.cardChoicesRight}>
                                <Text style={styles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        ) : (
                            <View style={styles.cardChoicesWrong}>
                                <Text style={styles.textChoice}>{question.choices[3]}</Text>
                            </View>
                        )}
                    </>
                );
            case QuestionTypes.NUMERIC:
                return (
                    <View style={{ borderColor: "white" }}>
                        <Text style={styles.textChoice}> Result: {question.solution.result}</Text>
                        <Text style={styles.textChoice}> Epsilon: {question.solution.epsilon}</Text>
                    </View>
                );
            default:
                return <></>;
        }
        // TODO:  View Elemente für jeden Durchlauf in eine Arraylist pushen
        // Object.entries(question.choices).forEach(([key, value]) => {
        //     return renderAnswers2(key, value);
        // });
    }

    // function renderAnswers2(key: string, value: string) {
    //     return (
    //         <View style={{ borderColor: "white" }}>
    //             <Text>{value}</Text>
    //         </View>
    //     );
    // }
};

const styles = StyleSheet.create({
    card: {
        shadowRadius: 10,
        shadowOffset: { width: -1, height: 1 },
        margin: 8,
        minWidth: "40%",
        marginRight: 20,
        backgroundColor: dark.Opacity.darkBlue1,
        textAlign: "center",
    },
    cardChoicesRight: {
        margin: 8,
        minHeight: 40,
        width: "40%",
        backgroundColor: dark.Opacity.darkGreen,
        borderColor: dark.theme.darkGreen,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
    },
    cardChoicesWrong: {
        minHeight: 40,
        margin: 8,
        width: "40%",
        backgroundColor: dark.Opacity.pink,
        borderColor: dark.theme.pink,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
    },
    cardHeader: {
        margin: 8,
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
        marginTop: 1,
    },
    textChoice: {
        color: "white",
        fontSize: 20,
    },
});
