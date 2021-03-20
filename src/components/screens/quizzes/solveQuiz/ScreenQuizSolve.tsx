import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { TextButton } from "../../../uiElements/TextButton";
import { ScrollView } from "react-native-gesture-handler";
import { SolveSingleChoiceCard } from "../../../cards/SolveSingleChoiceCard";
import { QuestionTypes } from "../../../../constants/QuestionTypes";

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
                    switch (question.type) {
                        case QuestionTypes.SINGLE_CHOICE:
                            return <SolveSingleChoiceCard question={question}></SolveSingleChoiceCard>;
                    }
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
