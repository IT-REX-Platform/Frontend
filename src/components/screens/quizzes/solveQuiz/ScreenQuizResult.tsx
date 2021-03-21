import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import { ResultSingleChoiceCard } from "../../../cards/ResultSingleChoiceCard";
import { quizStyles } from "../quizStyles";
import { ResultMultipleChoiceCard } from "../../../cards/ResultMultipleChoiceCard";
import i18n from "../../../../locales";
import { LocalizationContext } from "../../../Context";
import { isNumericResultCorrect, ResultNumericCard } from "../../../cards/ResultNumericCard";

type ScreenQuizResultProps = RouteProp<CourseStackParamList, "QUIZ_RESULT">;

export const ScreenQuizResult: React.FC = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenQuizResultProps>();
    const quiz: IQuiz = route.params.quiz;

    const navigation = useNavigation();
    return (
        <ImageBackground source={require("../../../../constants/images/Background1-1.png")} style={quizStyles.image}>
            <Text style={quizStyles.quizTitle}>{quiz.name}</Text>
            <ScrollView>
                <Text style={quizStyles.solutionContent}>
                    {i18n.t("itrex.youReached")}
                    {correctnessPercentage(quiz)}
                    {i18n.t("itrex.percentageOf")}
                </Text>
                <Text style={quizStyles.solutionContent}>
                    {correctlySolved(quiz)} {i18n.t("itrex.outOf")} {quiz.questions.length}{" "}
                    {i18n.t("itrex.solvedCorrectly")}
                </Text>
                {quiz.questions.map((question) => {
                    switch (question.type) {
                        case QuestionTypes.SINGLE_CHOICE:
                            return <ResultSingleChoiceCard question={question} />;
                        case QuestionTypes.MULTIPLE_CHOICE:
                            return <ResultMultipleChoiceCard question={question} />;
                        case QuestionTypes.NUMERIC:
                            return <ResultNumericCard question={question} />;
                    }
                })}
                <View style={quizStyles.buttonQuizzes}>
                    <TextButton
                        title={"Return to chapter"}
                        onPress={() => {
                            clearQuizEntries(quiz);
                            navigation.navigate("INFO", { screen: "OVERVIEW" });
                        }}></TextButton>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

function correctlySolved(quiz: IQuiz): number {
    let amountCorrectlySolved = 0;

    // eslint-disable-next-line complexity
    quiz.questions.map((question) => {
        switch (question.type) {
            case QuestionTypes.SINGLE_CHOICE:
                if (question.solution === question.userInput) {
                    amountCorrectlySolved += 1;
                }
                break;
            case QuestionTypes.MULTIPLE_CHOICE:
                if (JSON.stringify(question.solution) === JSON.stringify(question.userInput)) {
                    amountCorrectlySolved += 1;
                }
                break;
            case QuestionTypes.NUMERIC:
                if (isNumericResultCorrect(question)) {
                    amountCorrectlySolved += 1;
                }
        }
    });

    return amountCorrectlySolved;
}

export function clearQuizEntries(quiz: IQuiz): void {
    quiz.questions.map((question) => {
        question.userInput = undefined;
    });
}

function correctnessPercentage(quiz: IQuiz): number {
    const amountCorrectlySolved: number = correctlySolved(quiz);

    const percentage: number = (amountCorrectlySolved * 100) / quiz.questions.length;

    return Math.round(percentage);
}
