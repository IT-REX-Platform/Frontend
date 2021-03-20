import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { QuestionCard } from "../../../cards/QuestionCard";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList, NavigationRoutes } from "../../../../constants/navigators/NavigationRoutes";
import { TextButton } from "../../../uiElements/TextButton";
import { ScrollView } from "react-native-gesture-handler";

type ScreenQuizSolveProps = RouteProp<CourseStackParamList, "QUIZ_SOLVE">;

export const ScreenQuizSolve: React.FC = () => {
    const route = useRoute<ScreenQuizSolveProps>();
    const quiz: IQuiz = route.params.quiz;

    const navigation = useNavigation();

    console.log(quiz.questions);

    return (
        <>
            <ScrollView style={{}}>
                <Text>{quiz.name}</Text>
                <Text>TEEEEST</Text>

                {quiz.questions.map((question) => {
                    console.log(question);
                    return <QuestionCard question={question} quiz={quiz} courseId={question.courseId}></QuestionCard>;
                })}

                <TextButton
                    title={"Finish Quiz"}
                    onPress={() => {
                        navigation.navigate("QUIZ_RESULT", {
                            quiz,
                        });
                    }}></TextButton>
            </ScrollView>
        </>
    );
};
