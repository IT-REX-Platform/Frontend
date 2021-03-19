/* eslint-disable complexity */
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, View, TextInput, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../../../../locales";
import { QuestionTypes } from "../../../../constants/QuestionTypes";

import Select from "react-select";
import { ISolutionMultipleChoice, ISolutionNumeric } from "../../../../types/ISolution";
import { NumericQuestion } from "./NumericQuestion";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { IQuiz } from "../../../../types/IQuiz";
import { CourseStackParamList } from "../../../../constants/navigators/NavigationRoutes";
import { quizStyles } from "../quizStyles";

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CREATE_QUESTION">;

export const ScreenAddQuestion: React.FC = () => {
    React.useContext(LocalizationContext);
    const [questionText, setQuestionText] = useState<string>(i18n.t("itrex.addQuestionText"));
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const courseId = route.params.courseId;
    const quizTemp = route.params.quiz;
    const question = route.params.question;
    const [quiz] = useState<IQuiz | undefined>(quizTemp);

    // Selection choices
    const kindOfQuestionOptions = [
        { value: QuestionTypes.MULTIPLE_CHOICE, label: "Multiple Choice" },
        { value: QuestionTypes.SINGLE_CHOICE, label: "Single Choice" },
        { value: QuestionTypes.NUMERIC, label: "Numeric" },
    ];

    const [solutionNum, setSolutionNum] = useState<ISolutionNumeric>();
    const [solutionMultiChoice, setSolutionMutliChoice] = useState<ISolutionMultipleChoice>();
    const [solutionSingleChoice, setSolutionSingleChoice] = useState<string>();

    // Make Single Choice default or saved user selection.
    const index = kindOfQuestionOptions.findIndex((x) => x.value == question?.type);
    const defaultKindOfQuestionValue = index !== -1 ? kindOfQuestionOptions[index] : kindOfQuestionOptions[1];

    const [selectedKindOfQuestion, setKindOfQuestion] = useState<QuestionTypes | undefined>(
        defaultKindOfQuestionValue.value
    );

    useFocusEffect(
        // eslint-disable-next-line complexity
        React.useCallback(() => {
            if (question === undefined) {
                setKindOfQuestion(selectedKindOfQuestion);
                return;
            } else {
                setQuestionText(question.question);
                switch (question.type) {
                    case QuestionTypes.SINGLE_CHOICE:
                        setSolutionSingleChoice(question.solution);
                        break;
                    case QuestionTypes.MULTIPLE_CHOICE:
                        setSolutionMutliChoice(question.solution);
                        break;
                    case QuestionTypes.NUMERIC:
                        setSolutionNum(question.solution);
                }
            }
        }, [selectedKindOfQuestion, solutionNum, solutionMultiChoice, solutionSingleChoice])
    );

    return (
        <ImageBackground source={require("../../../../constants/images/Background1-1.png")} style={quizStyles.image}>
            <View style={[quizStyles.headContainer]}>
                <View style={quizStyles.borderContainer}>
                    <TextInput
                        style={quizStyles.questionInput}
                        value={questionText}
                        onChangeText={(text) => {
                            setQuestionText(text);
                        }}
                        multiline={true}
                    />
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={quizStyles.icon} />
                </View>
            </View>
            {selectKindOfQuestion()}
            {setInputFields()}
        </ImageBackground>
    );

    /**
     * Selection for the kind of question to add.
     *
     * @returns
     */
    function selectKindOfQuestion() {
        return (
            <View style={quizStyles.card}>
                <Text style={quizStyles.cardHeader}>{i18n.t("itrex.kindOfQuestion")}</Text>
                <View style={quizStyles.filterContainer}>
                    <View style={{ padding: 8, flex: 1 }}>
                        <Select
                            options={kindOfQuestionOptions}
                            defaultValue={defaultKindOfQuestionValue}
                            onChange={(option) => setKindOfQuestion(option?.value)}
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 5,
                                colors: {
                                    ...theme.colors,
                                    primary25: dark.Opacity.darkBlue1,
                                    primary: dark.Opacity.pink,
                                    backgroundColor: dark.Opacity.darkBlue1,
                                },
                            })}
                        />
                    </View>
                </View>
            </View>
        );
    }

    /**
     * Set the input fields for the selected kind of question.
     * @returns
     *
     */
    function setInputFields() {
        switch (selectedKindOfQuestion) {
            case QuestionTypes.NUMERIC:
                if (question?.type === QuestionTypes.NUMERIC) {
                    return (
                        <NumericQuestion
                            courseId={courseId}
                            questionText={questionText}
                            question={question}
                            quiz={quiz}
                        />
                    );
                } else {
                    return <NumericQuestion courseId={courseId} questionText={questionText} quiz={quiz} />;
                }
            case QuestionTypes.SINGLE_CHOICE:
                if (question?.type === QuestionTypes.SINGLE_CHOICE) {
                    return (
                        <SingleChoiceQuestion
                            courseId={courseId}
                            questionText={questionText}
                            question={question}
                            quiz={quiz}
                        />
                    );
                } else {
                    return <SingleChoiceQuestion courseId={courseId} questionText={questionText} quiz={quiz} />;
                }
            case QuestionTypes.MULTIPLE_CHOICE:
                if (question?.type === QuestionTypes.MULTIPLE_CHOICE) {
                    return (
                        <MultipleChoiceQuestion
                            courseId={courseId}
                            questionText={questionText}
                            question={question}
                            quiz={quiz}
                        />
                    );
                } else {
                    return <MultipleChoiceQuestion courseId={courseId} questionText={questionText} quiz={quiz} />;
                }
        }
    }
};
