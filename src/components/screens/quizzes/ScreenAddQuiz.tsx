/* eslint-disable complexity */
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, ImageBackground, View, TextInput, TouchableOpacity } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { CourseContext, LocalizationContext } from "../../Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextButton } from "../../uiElements/TextButton";
import i18n from "../../../locales";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { ScreenCourseOverviewNavigationProp } from "../course/ScreenCourseInformation";
import { ScrollView } from "react-native-gesture-handler";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";
import { validateQuiz } from "../../../helperScripts/validateQuiz";
import { IQuiz } from "../../../types/IQuiz";
import { CourseStackParamList } from "../../../constants/navigators/NavigationRoutes";
import { EndpointsQuiz } from "../../../api/endpoints/EndpointsQuiz";
import { quizStyles } from "./quizStyles";
import { QuestionTypes } from "../../../constants/QuestionTypes";
import { CreationSingleChoiceCard } from "../../cards/questionCreationCards/CreationSingleChoiceCard";
import { CreationMultipleChoiceCard } from "../../cards/questionCreationCards/CreationMultipleChoiceCard";
import { CreationNumericCard } from "../../cards/questionCreationCards/CreationNumericCard";

interface ChapterComponentProps {
    quiz?: IQuiz;
}

const endpointsQuiz: EndpointsQuiz = new EndpointsQuiz();
type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CREATE_QUIZ">;

export const ScreenAddQuiz: React.FC<ChapterComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();
    const route = useRoute<ScreenCourseTabsRouteProp>();

    // Get course infos from context.
    const { course } = React.useContext(CourseContext);
    let quizWithQuestions = props.quiz;

    if (route.params !== undefined) {
        quizWithQuestions = route.params.quiz;
    }

    const courseId = course.id;
    const initialQuizName = quizWithQuestions?.name == undefined ? "My new Quiz" : quizWithQuestions.name;

    const [quiz] = useState<IQuiz>({} as IQuiz);
    const [quizName, setQuizName] = useState<string>(initialQuizName);

    const [questions, setQuestions] = useState<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]>(
        []
    );

    useFocusEffect(
        React.useCallback(() => {
            if (props.quiz !== undefined) {
                return;
            } else {
                if (quizWithQuestions === undefined) {
                    return;
                }
                setQuestions(quizWithQuestions.questions);
            }
        }, [])
    );

    return (
        <ImageBackground
            source={require("../../../constants/images/Background1-1.png")}
            style={quizStyles.image}
            imageStyle={{ opacity: 0.5, position: "absolute", resizeMode: "stretch" }}>
            <View style={[quizStyles.headContainer]}>
                <View style={quizStyles.borderContainer}>
                    <TextInput
                        style={quizStyles.quizHeader}
                        value={quizName}
                        onChangeText={(text) => setQuizName(text)}
                    />
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={quizStyles.icon} />
                </View>
                <View>
                    {quizWithQuestions?.id !== undefined && (
                        <TextButton color="pink" title={i18n.t("itrex.delete")} onPress={() => deleteQuiz()} />
                    )}
                </View>

                <View>
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveQuiz()} />
                </View>
            </View>

            <View style={{ flex: 2, paddingLeft: "3%" }}>
                {displayQuestions()}
                <View style={[quizStyles.addQuizContainer]}>
                    <TouchableOpacity style={quizStyles.btnAdd} onPress={() => navigateTo()}>
                        <Text style={quizStyles.txtAddQuestion}>{i18n.t("itrex.addQuestion")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );

    /**
     * Navigate to the Question creation page.
     *
     */
    function navigateTo() {
        if (courseId === undefined) {
            return;
        }
        const myNewQuiz: IQuiz = {
            id: quizWithQuestions?.id,
            courseId: courseId,
            name: quizName,
            questions: questions,
        };

        navigation.navigate("CREATE_QUESTION", { quiz: myNewQuiz, courseId: courseId });
    }

    /**
     * Display questions if existing.
     *
     */
    function displayQuestions() {
        if (courseId === undefined) {
            return;
        }
        const myNewQuiz: IQuiz = {
            id: quizWithQuestions?.id,
            courseId: courseId,
            name: quizName,
            questions: questions,
        };

        if (questions === undefined || questions.length === 0) {
            return (
                <View style={{ minHeight: "85%", alignItems: "center" }}>
                    <Text style={quizStyles.txtAddQuestion}>{i18n.t("itrex.noQuestions")}</Text>
                </View>
            );
        } else {
            return (
                <ScrollView style={quizStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {questions.map((question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric) => {
                        switch (question.type) {
                            case QuestionTypes.SINGLE_CHOICE:
                                return (
                                    <CreationSingleChoiceCard
                                        question={question}
                                        quiz={myNewQuiz}
                                        courseId={courseId}
                                    />
                                );
                            case QuestionTypes.MULTIPLE_CHOICE:
                                return (
                                    <CreationMultipleChoiceCard
                                        question={question}
                                        quiz={myNewQuiz}
                                        courseId={courseId}
                                    />
                                );
                            case QuestionTypes.NUMERIC:
                                return <CreationNumericCard question={question} quiz={myNewQuiz} courseId={courseId} />;
                        }
                    })}
                </ScrollView>
            );
        }
    }

    /**
     * Creates a server request to save a quiz if not existing.
     *
     */
    function saveQuiz() {
        if (quizWithQuestions?.id !== undefined) {
            updateQuiz();
            return;
        }

        if (validateQuiz(courseId, quizName, questions)) {
            const myNewQuiz = validateQuiz(courseId, quizName, questions);
            if (myNewQuiz === undefined || quiz === undefined) {
                return;
            }

            const request: RequestInit = RequestFactory.createPostRequestWithBody(myNewQuiz);
            const response = endpointsQuiz.createQuiz(
                request,
                i18n.t("itrex.saveQuizSuccess"),
                i18n.t("itrex.saveQuizError")
            );

            response.then((quiz) => {
                console.log(quiz);
                navigation.navigate("QUIZ_POOL");
            });
        }
    }

    /**
     * Creates a server request to update an existing quiz.
     *
     */
    function updateQuiz() {
        if (validateQuiz(courseId, quizName, questions)) {
            const quizToUpdate = validateQuiz(courseId, quizName, questions);

            if (quizToUpdate === undefined || quiz === undefined) {
                return;
            }
            quizToUpdate.id = quizWithQuestions?.id;
            const request: RequestInit = RequestFactory.createPutRequest(quizToUpdate);
            const response = endpointsQuiz.createQuiz(
                request,
                i18n.t("itrex.updateQuizSuccess"),
                i18n.t("itrex.updateQuizError")
            );
            response.then((quiz) => {
                console.log(quiz);
                navigation.navigate("QUIZ_POOL");
            });
        }
    }

    /**
     * Creates a server request to delete a existing quiz.
     */
    function deleteQuiz() {
        if (quizWithQuestions?.id === undefined) {
            return;
        }
        const request: RequestInit = RequestFactory.createDeleteRequest();
        const quizId = quizWithQuestions.id;
        const response = endpointsQuiz.deleteQuiz(
            request,
            quizId,
            undefined,
            i18n.t("itrex.deleteQuizSuccess"),
            i18n.t("itrex.deleteQuizError")
        );
        response.then((questions) => {
            console.log(questions), navigation.navigate("QUIZ_POOL");
        });
    }
};
