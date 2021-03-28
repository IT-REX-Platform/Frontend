/* eslint-disable complexity */
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IQuestionSingleChoice } from "../../../types/IQuestion";
import { IQuiz } from "../../../types/IQuiz";
import { LocalizationContext } from "../../Context";
import { cardStyles } from "../cardStyles";

interface QuestionCardProps {
    question: IQuestionSingleChoice;
    quiz: IQuiz;
    courseId: string;
}

export const CreationSingleChoiceCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const question = props.question;
    const quiz = props.quiz;
    const courseId = props.courseId;

    return (
        <TouchableOpacity
            style={cardStyles.card}
            onPress={() =>
                navigation.navigate("CREATE_QUESTION", { courseId: courseId, quiz: quiz, question: question })
            }>
            <MaterialCommunityIcons name="check" color="white" size={26} style={{ position: "absolute", margin: 8 }} />
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderChoices()}</View>
        </TouchableOpacity>
    );

    function renderChoices() {
        return (
            <>
                {question.solution === "0" ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                    </View>
                )}

                {question.solution === "1" ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                    </View>
                )}

                {question.solution === "2" ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                    </View>
                )}

                {question.solution === "3" ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[3]}</Text>
                    </View>
                )}
            </>
        );
    }
};
