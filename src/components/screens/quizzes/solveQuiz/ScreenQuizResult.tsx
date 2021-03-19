import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";
import { ICourse } from "../../../../types/ICourse";

interface screenQuizResultProps {
    quiz: IQuiz;
    course: ICourse;
}

export const ScreenQuizOverview: React.FC<screenQuizResultProps> = (props) => {
    const { quiz, course } = props;

    const navigation = useNavigation();

    return (
        <>
            <Text>{course.name}</Text>
            <Text>{quiz.name}</Text>
            <Text>You solve X out of {quiz.questions.length} questions</Text>

            {/* Add Navigation route */}
            <TextButton title={"Return to chapter"} onPress={() => navigation.navigate("")}></TextButton>
        </>
    );
};
