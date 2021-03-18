/* eslint-disable complexity */
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { CourseContext, LocalizationContext } from "../../Context";
import { IChapter } from "../../../types/IChapter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextButton } from "../../uiElements/TextButton";
import i18n from "../../../locales";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../../api/endpoints/EndpointsChapter";
import { ScreenCourseOverviewNavigationProp } from "../course/ScreenCourseOverview";
import { QuestionCard } from "../../cards/QuestionCard";
import { ScrollView } from "react-native-gesture-handler";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";
import { validateQuiz } from "../../../helperScripts/validateQuiz";
import { IQuiz } from "../../../types/IQuiz";
import { CourseStackParamList } from "../../../constants/navigators/NavigationRoutes";
import { EndpointsQuiz } from "../../../api/endpoints/EndpointsQuiz";
import { EndpointsContentReference } from "../../../api/endpoints/EndpointsContentReference";
import { CONTENTREFERENCETYPE, IContent } from "../../../types/IContent";
import { ICourse } from "../../../types/ICourse";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
    quiz?: IQuiz;
}

const endpointsQuiz: EndpointsQuiz = new EndpointsQuiz();
type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CREATE_QUIZ">;
const contentReferenceEndpoint = new EndpointsContentReference();

export const ScreenAddQuiz: React.FC<ChapterComponentProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();
    const route = useRoute<ScreenCourseTabsRouteProp>();

    // Get course infos from context.
    const course: ICourse = React.useContext(CourseContext);
    console.log(course);
    let quizWithQuestions = props.quiz;

    if (route.params !== undefined) {
        quizWithQuestions = route.params.quiz;
    }

    console.log(quizWithQuestions);

    const courseId = course.id;

    const initialQuizName = quizWithQuestions?.name == undefined ? "My new Quiz" : quizWithQuestions.name;

    const [quiz] = useState<IQuiz>({} as IQuiz);
    const chapterEndpoint = new EndpointsChapter();
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
                console.log(questions);
            }
        }, [])
    );

    return (
        <ImageBackground source={require("../../../constants/images/Background1-1.png")} style={styles.image}>
            <View style={[styles.headContainer]}>
                <View style={styles.borderContainer}>
                    <TextInput style={styles.quizHeader} value={quizName} onChangeText={(text) => setQuizName(text)} />
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
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

            <View style={styles.contentContainer}>
                {displayQuestions()}
                <View style={[styles.addQuizContainer]}>
                    <TouchableOpacity style={styles.btnAdd} onPress={() => navigateTo()}>
                        <Text style={styles.txtAddQuestion}>{i18n.t("itrex.addQuestion")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );

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
                    <Text style={styles.txtAddQuestion}>{i18n.t("itrex.noQuestions")}</Text>
                </View>
            );
        } else {
            return (
                <ScrollView style={styles.scrollContainer}>
                    {questions.map((question: IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric) => {
                        return <QuestionCard question={question} quiz={myNewQuiz} courseId={courseId} />;
                    })}
                </ScrollView>
            );
        }
    }

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
            console.log(questions), navigation.navigate("TIMELINE");
        });
    }
};

const styles = StyleSheet.create({
    headContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingTop: "3%",
        paddingLeft: "3%",
    },
    scrollContainer: {
        width: "screenWidth",
        paddingBottom: 20,
    },
    borderContainer: {
        flex: 3,
        flexDirection: "row",
        borderBottomColor: "rgba(70,74,91,0.5)",
        borderBottomWidth: 3,
    },
    quizHeader: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    txtAddQuestion: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    addQuizContainer: {
        flexDirection: "column",
        backgroundColor: "rgba(0,0,0,0.3)",
        height: "50px",
        width: "90%",
        padding: "0.5%",
        margin: 20,
        borderWidth: 3,
        borderColor: dark.theme.lightBlue,
    },
    btnAdd: {
        width: "100%",
        height: "100%",
        borderWidth: 2,
        borderColor: "rgba(79,175,165,1.0)",
        borderRadius: 25,
        borderStyle: "dotted",
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        flex: 2,
        paddingLeft: "3%",
    },
});
