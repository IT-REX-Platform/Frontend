import React from "react";
import { IQuiz } from "../../../../types/IQuiz";
import { Text } from "react-native";
import { TextButton } from "../../../uiElements/TextButton";
import { useNavigation } from "@react-navigation/core";

interface screenQuizResultProps {
    quiz: IQuiz;
    courseName: string;
}

export const ScreenQuizOverview: React.FC<screenQuizResultProps> = (props) => {
    const { quiz, courseName } = props;

    const navigation = useNavigation();

    return (
        <>
            <Text>{courseName}</Text>
            <Text>{quiz.name}</Text>
            <Text>You solve X out of {quiz.questions.length} questions</Text>

            {/* Add Navigation route */}
            <TextButton title={"Return to chapter"} onPress={() => navigation.navigate("")}></TextButton>
        </>
    );
};
