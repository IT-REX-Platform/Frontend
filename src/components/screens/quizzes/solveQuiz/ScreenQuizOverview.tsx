import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";

interface screenQuizOverviewProps {
    quiz: IQuiz;
    courseName: string;
}

export const ScreenQuizOverview: React.FC<screenQuizOverviewProps> = (props) => {
    const { quiz, courseName } = props;

    const navigation = useNavigation();

    return (
        <>
            <Text>{courseName}</Text>
            <Text>{quiz.name}</Text>
            <Text>This quiz consists out of {quiz.questions.length} questions</Text>
            {/* Add Navigation route */}
            <TextButton title={"Start Quiz"} onPress={() => navigation.navigate("")}></TextButton>
        </>
    );
};
