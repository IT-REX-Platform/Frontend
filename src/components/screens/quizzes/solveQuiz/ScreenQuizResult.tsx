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
import { ResultNumericCard } from "../../../cards/ResultNumericCard";
import { clearQuizEntries, correctlySolved, correctnessPercentage } from "../../../../helperScripts/solveQuizHelpers";

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
                        title={i18n.t("itrex.returnToTimeline")}
                        onPress={() => {
                            clearQuizEntries(quiz);

                            // Navigate back to Timeline
                            navigation.navigate("INFO", { screen: "TIMELINE" });
                        }}></TextButton>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};
