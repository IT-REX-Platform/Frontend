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

    if (chapterId == "undefined") {
        chapterId = undefined;
    }

    const initialQuizName = chapterId == undefined ? "My new Quiz" : "";

    const [quiz] = useState<IQuiz>({} as IQuiz);
    const chapterEndpoint = new EndpointsChapter();
    const [quizName, setQuizName] = useState<string>(initialQuizName);
    // TODO:
    const [questions, setQuestions] = useState<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]>(
        quizList[0].questions
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
        const myNewQuiz: IQuiz = {
            courseId: "",
            name: quizName,
            questions: questions,
        };

        navigation.navigate("CREATE_QUESTION", { quiz: myNewQuiz });
    }

    function displayQuestions() {
        if (quizList === undefined || quizList.length === 0) {
            return;
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
        createAlert("Save the quiz");

        if (validateQuiz(quizName, questions)) {
            const myNewQuiz = validateQuiz(quizName, questions);
            toast.success("Jetzt nur noch speichern");
        }
        // TODO: Create new IQuiz Element with the user infromation & send Request to save
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
