import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { ImageBackground, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { TextButton } from "../../../uiElements/TextButton";
import { ScrollView } from "react-native-gesture-handler";
import { QuestionTypes } from "../../../../constants/QuestionTypes";
import { SolveMultipleChoiceCard } from "../../../cards/questionSolveCards/SolveMultipleChoiceCard";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../../types/IQuestion";

import { quizStyles } from "../quizStyles";
import i18n from "../../../../locales";
import { LocalizationContext } from "../../../Context";
import { SolveSingleChoiceCard } from "../../../cards/questionSolveCards/SolveSingleChoiceCard";
import { SolveNumericCard } from "../../../cards/questionSolveCards/SolveNumericCard";

type ScreenQuizSolveProps = RouteProp<CourseStackParamList, "QUIZ_SOLVE">;

export const ScreenQuizSolve: React.FC = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenQuizSolveProps>();
    const quiz: IQuiz = route.params.quiz;
    const chapterId: string = route.params.chapterId;

    const navigation = useNavigation();

    const solutionClickCallback = (
        question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined
    ) => {
        const index = quiz.questions.findIndex((questionToUpdate) => questionToUpdate.id === question?.id);
        quiz.questions[index].userInput = question?.userInput;
    };

    return (
        <>
            <ImageBackground
                source={require("../../../../constants/images/Background1-1.png")}
                style={quizStyles.image}>
                <Text style={quizStyles.quizTitle}>{quiz.name}</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={quizStyles.questionContents}>
                        {quiz.questions.map((question) => {
                            switch (question.type) {
                                case QuestionTypes.SINGLE_CHOICE:
                                    return (
                                        <SolveSingleChoiceCard
                                            question={question}
                                            onSolutionClicked={solutionClickCallback}></SolveSingleChoiceCard>
                                    );
                                case QuestionTypes.MULTIPLE_CHOICE:
                                    return (
                                        <SolveMultipleChoiceCard
                                            question={question}
                                            onSolutionClicked={solutionClickCallback}></SolveMultipleChoiceCard>
                                    );
                                case QuestionTypes.NUMERIC:
                                    return (
                                        <SolveNumericCard
                                            question={question}
                                            onSolutionClicked={solutionClickCallback}></SolveNumericCard>
                                    );
                            }
                        })}

                        <TextButton
                            title={i18n.t("itrex.finishQuiz")}
                            onPress={() => {
                                navigation.navigate("QUIZ_RESULT", {
                                    quiz,
                                    chapterId,
                                });
                            }}></TextButton>
                    </View>
                </ScrollView>
            </ImageBackground>
        </>
    );
};
