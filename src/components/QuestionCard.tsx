/* eslint-disable complexity */
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { dark } from "../constants/themes/dark";
import { IQuestion } from "../types/IQuestion";

interface QuestionCardProps {
    question: IQuestion;
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
        return (
            <>
                {question.solution === "0" ? (
                    <View style={styles.cardChoicesRight}>
                        <Text style={styles.textChoice}>{question.choices[0]}</Text>
                    </View>
                ) : (
                    <View style={styles.cardChoicesWrong}>
                        <Text style={styles.textChoice}>{question.choices[0]}</Text>
                    </View>
                )}

                {question.solution === "1" ? (
                    <View style={styles.cardChoicesRight}>
                        <Text style={styles.textChoice}>{question.choices[1]}</Text>
                    </View>
                ) : (
                    <View style={styles.cardChoicesWrong}>
                        <Text style={styles.textChoice}>{question.choices[1]}</Text>
                    </View>
                )}

                {question.solution === "2" ? (
                    <View style={styles.cardChoicesRight}>
                        <Text style={styles.textChoice}>{question.choices[2]}</Text>
                    </View>
                ) : (
                    <View style={styles.cardChoicesWrong}>
                        <Text style={styles.textChoice}>{question.choices[2]}</Text>
                    </View>
                )}

                {question.solution === "3" ? (
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
        backgroundColor: dark.Opacity.grey,
    },
    cardChoicesRight: {
        margin: 8,
        minHeight: 40,
        width: "40%",
        backgroundColor: dark.Opacity.grey,
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
        backgroundColor: dark.Opacity.grey,
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
