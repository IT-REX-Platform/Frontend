import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { QuestionCard } from "../../../cards/QuestionCard";
import { ICourse } from "../../../../types/ICourse";

interface screenQuizSolveProps {
    quiz: IQuiz;
    course: ICourse;
}

export const ScreenQuizSolve: React.FC<screenQuizSolveProps> = (props) => {
    const { quiz, course } = props;

    const navigation = useNavigation();

    return (
        <>
            <Text>{course.name}</Text>
            <Text>{quiz.name}</Text>

            {quiz.questions.forEach((question) => {
                !!course.id && <QuestionCard question={question} quiz={quiz} courseId={course.id}></QuestionCard>;
            })}
        </>
    );
};

// case QuestionTypes.SINGLE_CHOICE:
//     return <SolveSingleChoiceQuestion />;
// case QuestionTypes.MULTIPLE_CHOICE:
//     return <SolveMultipleChoiceQuestion />;
// case QuestionTypes.NUMERIC:
//     return <SolveNumericQuestion />;
