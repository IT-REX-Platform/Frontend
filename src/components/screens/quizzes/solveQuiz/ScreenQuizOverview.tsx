import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { IQuiz } from "../../../../types/IQuiz";
import { quizStyles } from "../quizStyles";
import i18n from "../../../../locales";

type ScreenQuizOverviewProps = RouteProp<CourseStackParamList, "QUIZ_OVERVIEW">;

export const ScreenQuizOverview: React.FC = () => {
    const route = useRoute<ScreenQuizOverviewProps>();
    const quiz: IQuiz = route.params.quiz;

    const navigation = useNavigation();

    return (
        <>
            <ImageBackground
                source={require("../../../../constants/images/Background1-1.png")}
                style={quizStyles.image}>
                <View style={quizStyles.quizOverview}>
                    <Text style={quizStyles.titleFont}>{quiz.name}</Text>
                    <Text style={quizStyles.quizContent}>
                        {i18n.t("itrex.quizConsists")}
                        {quiz.questions.length}
                        {i18n.t("itrex.quizQuestions")}
                    </Text>

                    <TextButton
                        title={"Start Quiz"}
                        onPress={() => {
                            navigation.navigate("QUIZ_SOLVE", {
                                quiz,
                            });
                        }}></TextButton>
                </View>
            </ImageBackground>
        </>
    );
};
