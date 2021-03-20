import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { QuestionCard } from "../../../cards/QuestionCard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";

type ScreenQuizSolveProps = RouteProp<CourseStackParamList, "QUIZ_SOLVE">;

export const ScreenQuizSolve: React.FC = () => {
    const route = useRoute<ScreenQuizSolveProps>();
    const quiz: IQuiz = route.params.quiz;

    const navigation = useNavigation();

    console.log(quiz.questions);

    return (
        <>
            <Text>{quiz.name}</Text>
            <Text>TEEEEST</Text>

            {quiz.questions.map((question) => {
                console.log(question);
                return <QuestionCard question={question} quiz={quiz} courseId={question.courseId}></QuestionCard>;
                // return <Text>HALLO 1 {question.question}</Text>;
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
