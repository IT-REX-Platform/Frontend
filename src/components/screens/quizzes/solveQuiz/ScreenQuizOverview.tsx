import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { ICourse } from "../../../../types/ICourse";

interface screenQuizOverviewProps {
    quiz: IQuiz;
    course: ICourse;
}

export const ScreenQuizOverview: React.FC<screenQuizOverviewProps> = (props) => {
    const { quiz, course } = props;

    const navigation = useNavigation();

    return (
        <>
            <Text>{course.name}</Text>
            <Text>{quiz.name}</Text>
            <Text>This quiz consists out of {quiz.questions.length} questions</Text>
            {/* Add Navigation route */}
            <TextButton title={"Start Quiz"} onPress={() => navigation.navigate("")}></TextButton>
        </>
    );
};
