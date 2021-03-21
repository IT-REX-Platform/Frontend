import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { ImageBackground, ScrollView, Text } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import { ResultSingleChoiceCard } from "../../../cards/ResultSingleChoiceCard";
import { quizStyles } from "../quizStyles";
import { ResultMultipleChoiceCard } from "../../../cards/ResultMultipleChoiceCard";

type ScreenQuizResultProps = RouteProp<CourseStackParamList, "QUIZ_RESULT">;

export const ScreenQuizResult: React.FC = () => {
    const route = useRoute<ScreenQuizResultProps>();
    const quiz: IQuiz = route.params.quiz;

    console.log(quiz);

    const navigation = useNavigation();
    return (
        <ImageBackground source={require("../../../../constants/images/Background1-1.png")} style={quizStyles.image}>
            <ScrollView>
                <Text>{quiz.name}</Text>
                <Text>
                    You solved {correctlySolved(quiz)} out of {quiz.questions.length} questions
                </Text>

                {quiz.questions.map((question) => {
                    switch (question.type) {
                        case QuestionTypes.SINGLE_CHOICE:
                            return <ResultSingleChoiceCard question={question}></ResultSingleChoiceCard>;
                        case QuestionTypes.MULTIPLE_CHOICE:
                            return <ResultMultipleChoiceCard question={question} />;
                        case QuestionTypes.NUMERIC:
                            return <></>;
                    }
                })}

                <TextButton
                    title={"Return to chapter"}
                    onPress={() => {
                        clearQuizEntries(quiz);
                        navigation.navigate("INFO", { screen: "OVERVIEW" });
                    }}></TextButton>
            </ScrollView>
        </ImageBackground>
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

function clearQuizEntries(quiz: IQuiz): void {
    quiz.questions.map((question) => {
        question.userInput = undefined;
    });
}
