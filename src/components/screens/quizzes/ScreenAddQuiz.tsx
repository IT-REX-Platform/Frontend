/* eslint-disable complexity */
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, ImageBackground, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { quizList } from "../../../constants/fixtures/quizzes.fixture";
import { LocalizationContext } from "../../Context";
import { IChapter } from "../../../types/IChapter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextButton } from "../../uiElements/TextButton";
import { createAlert } from "../../../helperScripts/createAlert";
import i18n from "../../../locales";
import { RequestFactory } from "../../../api/requests/RequestFactory";
import { EndpointsChapter } from "../../../api/endpoints/EndpointsChapter";
import { ScreenCourseOverviewNavigationProp } from "../course/ScreenCourseOverview";
import { QuestionCard } from "../../cards/QuestionCard";
import { ScrollView } from "react-native-gesture-handler";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";
import { ToastService } from "../../../services/toasts/ToastService";
import { validateQuiz } from "../../../helperScripts/validateQuiz";
import { IQuiz } from "../../../types/IQuiz";
import { CourseStackParamList } from "../../../constants/navigators/NavigationRoutes";
import { EndpointsQuiz } from "../../../api/endpoints/EndpointsQuiz";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
}

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CREATE_QUIZ">;

export const ScreenAddQuiz: React.FC<ChapterComponentProps> = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    const toast: ToastService = new ToastService();

    let chapterId = route.params.chapterId;
    const quizWithQuestions = route.params.quiz;
    console.log(quizWithQuestions);
    const courseId = route.params.courseId;

    if (chapterId == "undefined") {
        chapterId = undefined;
    }

    const initialQuizName = chapterId == undefined ? "My new Quiz" : "";

    const [quiz] = useState<IQuiz>({} as IQuiz);
    const chapterEndpoint = new EndpointsChapter();
    const [quizName, setQuizName] = useState<string>(initialQuizName);

    const [questions, setQuestions] = useState<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]>(
        []
    );

    useFocusEffect(
        React.useCallback(() => {
            if (route.params.quiz === undefined) {
                if (chapterId != undefined) {
                    const request: RequestInit = RequestFactory.createGetRequest();
                    chapterEndpoint
                        .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
                        .then((chapter) => {
                            setQuizName(chapter.title + " - Quiz");
                        });
                } else {
                    quiz.name = "My new Quiz";
                }
            } else {
                if (quizWithQuestions === undefined) {
                    return;
                }
                setQuestions(quizWithQuestions.questions);
                setQuizName(quizWithQuestions.name);
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
                        return <QuestionCard question={question} />;
                    })}
                </ScrollView>
            );
        }
    }

    function saveQuiz() {
        const endpointsQuiz: EndpointsQuiz = new EndpointsQuiz();
        if (quizWithQuestions === undefined) {
            return;
        }
        if (quizWithQuestions.id !== undefined) {
            updateQuiz();
            return;
        }

        if (validateQuiz(courseId, quizName, questions)) {
            const myNewQuiz = validateQuiz(courseId, quizName, questions);
            if (myNewQuiz === undefined || quiz === undefined) {
                return;
            }

            const request: RequestInit = RequestFactory.createPostRequestWithBody(myNewQuiz);
            const response = endpointsQuiz.createQuiz(request, "OK", "ERROR");
            response.then((question) => console.log(question));
        }
    }

    function updateQuiz() {
        const endpointsQuiz: EndpointsQuiz = new EndpointsQuiz();

        if (validateQuiz(courseId, quizName, questions)) {
            const quizToUpdate = validateQuiz(courseId, quizName, questions);

            if (quizToUpdate === undefined || quiz === undefined) {
                return;
            }
            quizToUpdate.id = quizWithQuestions?.id;
            const request: RequestInit = RequestFactory.createPutRequest(quizToUpdate);
            const response = endpointsQuiz.createQuiz(request, "OK", "ERROR");
            response.then((question) => console.log(question));
        }
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
