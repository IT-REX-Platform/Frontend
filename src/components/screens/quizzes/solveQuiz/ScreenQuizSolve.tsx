import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import { useNavigation } from "@react-navigation/core";

interface screenQuizSolveProps {
    quiz: IQuiz;
    courseName: string;
}

export const ScreenQuizSolve: React.FC<screenQuizSolveProps> = (props) => {
    const { quiz, courseName } = props;

    const navigation = useNavigation();

    return (
        <>
            <Text>{courseName}</Text>
            <Text>{quiz.name}</Text>

            {quiz.questions.forEach((question) => {
                switch (question.type) {
                    case QuestionTypes.SINGLE_CHOICE:
                    //     return <SolveSingleChoiceQuestion />;
                    // case QuestionTypes.MULTIPLE_CHOICE:
                    //     return <SolveMultipleChoiceQuestion />;
                    // case QuestionTypes.NUMERIC:
                    //     return <SolveNumericQuestion />;
                }
            })}
        </>
    );
};
