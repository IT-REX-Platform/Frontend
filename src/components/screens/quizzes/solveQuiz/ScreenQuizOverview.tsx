import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { IQuiz } from "../../../../types/IQuiz";
import { quizStyles } from "../quizStyles";
import i18n from "../../../../locales";
import { LocalizationContext } from "../../../Context";

interface ScreenQuizOverviewProps {
    quiz: IQuiz;
    chapterId: string;
}

export const ScreenQuizOverview: React.FC<ScreenQuizOverviewProps> = (props) => {
    const { quiz, chapterId } = props;
    React.useContext(LocalizationContext);
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
                        title={i18n.t("itrex.startQuiz")}
                        onPress={() => {
                            navigation.navigate("QUIZ_SOLVE", {
                                quiz,
                                chapterId,
                            });
                        }}></TextButton>
                </View>
            </ImageBackground>
        </>
    );
};
