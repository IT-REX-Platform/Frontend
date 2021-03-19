import React from "react";
import { ImageBackground, Text } from "react-native";
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
                <Text>{course.name}</Text>
                <Text>{quiz.name}</Text>
                <Text>This quiz consists out of {quiz.questions.length} questions</Text>
                {/* Add Navigation route */}
                <TextButton title={"Start Quiz"} onPress={() => navigation.navigate("")}></TextButton>
            </ImageBackground>
        </>
    );
};
