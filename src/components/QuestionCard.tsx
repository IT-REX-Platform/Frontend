import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ICourse } from "../types/ICourse";
import { dark } from "../constants/themes/dark";
import { dateConverter } from "../helperScripts/validateCourseDates";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import i18n from "./../locales";
import { CoursePublishState } from "../constants/CoursePublishState";
import { IQuestion } from "../types/IQuestion";
import { AnswerCard } from "./AnserComponent";
import { IChoice } from "../types/IChoice";

interface QuestionCardProps {
    question: IQuestion;
}

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
    const { question } = props;
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>{question.question}</Text>
            <View style={styles.break} />
            {renderAnswers()}
        </View>
    );

    function renderAnswers() {
        return (
            <>
                <View style={{ borderColor: "white" }}>
                    <Text>{question.choices[0]}</Text>
                </View>

                <View style={{ borderColor: "white" }}>
                    <Text>{question.choices[1]}</Text>
                </View>

                <View style={{ borderColor: "white" }}>
                    <Text>{question.choices[2]}</Text>
                </View>

                <View style={{ borderColor: "white" }}>
                    <Text>{question.choices[3]}</Text>
                </View>
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
        width: "100%",
        backgroundColor: dark.Opacity.grey,
    },
    cardHeader: {
        margin: 8,
        marginLeft: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlignVertical: "center",
    },
    cardContent: {
        fontSize: 15,
        color: "white",
        textAlignVertical: "center",
        margin: 4,
        marginLeft: 32,
        minHeight: 20,
    },
    unpublishedCard: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderColor: dark.theme.pink,
        borderWidth: 2,
        textShadowColor: dark.theme.pink,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
        marginLeft: 295,
        marginTop: 5,
    },
    textUnpublished: {
        color: dark.theme.pink,
        fontSize: 10,
    },
    circleUnpublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.pink,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.pink,
        marginRight: 3,
    },
    publishedCard: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderColor: dark.theme.lightGreen,
        borderWidth: 2,
        textShadowColor: dark.theme.lightGreen,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 15,
        marginLeft: 295,
        marginTop: 5,
    },
    textPublished: {
        color: dark.theme.lightGreen,
        fontSize: 10,
    },
    circlePublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightGreen,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightGreen,
        marginRight: 5,
    },
    break: {
        backgroundColor: "white",
        opacity: 0.5,
        height: 1,
        marginTop: 1,
    },
});
