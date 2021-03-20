import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";

type ScreenQuizResultProps = RouteProp<CourseStackParamList, "QUIZ_RESULT">;

export const ScreenQuizResult: React.FC = () => {
    const route = useRoute<ScreenQuizResultProps>();
    const quiz: IQuiz = route.params.quiz;

    const navigation = useNavigation();
    return (
        <>
            <Text>Quiz Solution Screen</Text>
            <Text>{quiz.name}</Text>
            <Text>You solved X out of {quiz.questions.length} questions</Text>

            <TextButton
                title={"Return to chapter"}
                // Navigate back to Chapter Overview Page
                onPress={() => navigation.navigate("INFO", { screen: "OVERVIEW" })}></TextButton>
        </>
    );
};
