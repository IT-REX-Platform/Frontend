import React from "react";
import { ImageBackground, Text, StyleSheet, View } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { IQuiz } from "../../../../types/IQuiz";
import { quizStyles } from "../quizStyles";

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
                <View style={styles.container}>
                    <Text style={styles.quizTitle}>{quiz.name}</Text>
                    <Text style={styles.quizContent}>This quiz consists out of {quiz.questions.length} questions</Text>

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

const styles = StyleSheet.create({
    container: {
        margin: 16,
    },
    quizTitle: {
        fontSize: 24,
        color: "white",
        marginBottom: 24,
    },
    quizContent: {
        fontSize: 16,
        color: "white",
    },
});
