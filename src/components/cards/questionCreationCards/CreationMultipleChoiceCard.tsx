/* eslint-disable complexity */
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { IQuestionMultipleChoice } from "../../../types/IQuestion";
import { IQuiz } from "../../../types/IQuiz";
import { LocalizationContext } from "../../Context";
import { cardStyles } from "../cardStyles";

interface QuestionCardProps {
    question: IQuestionMultipleChoice;
    quiz: IQuiz;
    courseId: string;
}

export const CreationMultipleChoiceCard: React.FC<QuestionCardProps> = (props) => {
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
            <MaterialCommunityIcons name="check-all" color="white" size={26} style={cardStyles.questionKind} />
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={cardStyles.renderChoices}>{renderChoices()}</View>
        </TouchableOpacity>
    );

    function renderChoices() {
        return (
            <>
                {question.solution[0] === true ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[0]}</Text>
                    </View>
                )}

                {question.solution[1] === true ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[1]}</Text>
                    </View>
                )}

                {question.solution[2] === true ? (
                    <View style={cardStyles.cardChoicesRight}>
                        <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                    </View>
                ) : (
                    <View style={cardStyles.cardChoicesWrong}>
                        <Text style={cardStyles.textChoice}>{question.choices[2]}</Text>
                    </View>
                )}

                {question.solution[3] === true ? (
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
