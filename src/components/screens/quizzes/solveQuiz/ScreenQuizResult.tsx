import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import { ResultSingleChoiceCard } from "../../../cards/ResultSingleChoiceCard";

type ScreenQuizResultProps = RouteProp<CourseStackParamList, "QUIZ_RESULT">;

export const ScreenQuizResult: React.FC = () => {
    const route = useRoute<ScreenQuizResultProps>();
    const quiz: IQuiz = route.params.quiz;

    console.log(quiz);

    const navigation = useNavigation();
    return (
        <>
            <Text>Quiz Solution Screen</Text>
            <Text>{quiz.name}</Text>
            <Text>
                You solved {correctlySolved(quiz)} out of {quiz.questions.length} questions
            </Text>

            {quiz.questions.map((question) => {
                switch (question.type) {
                    case QuestionTypes.SINGLE_CHOICE:
                        return <ResultSingleChoiceCard question={question}></ResultSingleChoiceCard>;
                        return <></>;
                    case QuestionTypes.MULTIPLE_CHOICE:
                        return <></>;
                    case QuestionTypes.NUMERIC:
                        return <></>;
                }
            })}

            <TextButton
                title={"Return to chapter"}
                // Navigate back to Chapter Overview Page
                onPress={() => navigation.navigate("INFO", { screen: "OVERVIEW" })}></TextButton>
        </>
    );
};

function correctlySolved(quiz: IQuiz): number {
    let amountCorrectlySolved = 0;

    quiz.questions.map((question) => {
        if (JSON.stringify(question.solution) === JSON.stringify(question.userInput)) {
            amountCorrectlySolved += 1;
        }
    });

    return amountCorrectlySolved;
}
