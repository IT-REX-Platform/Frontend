import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
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
import { ScreenCourseTabsRouteProp } from "./ScreenCourseTabs";
import { ScreenCourseOverviewNavigationProp } from "./ScreenCourseOverview";
import { QuestionCard } from "../../QuestionCard";
import { ScrollView } from "react-native-gesture-handler";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";
import { IUser } from "../../../types/IUser";
import { ToastService } from "../../../services/toasts/ToastService";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
}

export const ScreenAddQuiz: React.FC<ChapterComponentProps> = () => {
    React.useContext(LocalizationContext);
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const navigation = useNavigation<ScreenCourseOverviewNavigationProp>();

    const toast: ToastService = new ToastService();

    let chapterId = route.params.chapterId;

    if (chapterId == "undefined") {
        chapterId = undefined;
    }
    const chapterEndpoint = new EndpointsChapter();
    const [chapter, setChapter] = useState<IChapter>({} as IChapter);
    const [user, setUserInfo] = useState<IUser>({});
    const [quizName, setQuizName] = useState<string>("");
    const [questions, setQuestions] = useState<
        Array<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
    >(quizList[0].questionObjects);

    useFocusEffect(
        React.useCallback(() => {
            if (chapterId != undefined) {
                const request: RequestInit = RequestFactory.createGetRequest();
                chapterEndpoint
                    .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
                    .then((chapter) => {
                        setQuizName(chapter.title + " - Quiz ");
                        console.log(quizList);
                    });
            } else {
                setQuizName("My new Quiz");
            }
        }, [])
    );

    return (
        <View style={styles.rootContainer}>
            <ImageBackground source={require("../../../constants/images/Background1-1.png")} style={styles.image}>
                <View style={[styles.headContainer]}>
                    <View style={styles.borderContainer}>
                        <TextInput
                            style={styles.quizHeader}
                            value={quizName}
                            onChangeText={(text) => setQuizName(text)}
                        />
                        <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                    </View>
                    <View>
                        <TextButton title={i18n.t("itrex.save")} onPress={() => saveQuiz()} />
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {displayQuestions()}
                    <View style={[styles.addQuizContainer]}>
                        <TouchableOpacity
                            style={styles.btnAdd}
                            onPress={() => (console.log(questions), navigation.navigate("CREATE_QUESTION"))}>
                            <Text style={styles.txtAddQuestion}>+ Add Question</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );

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

        if (questions === undefined || questions.length < 1) {
            toast.error("Add at least 1 question!");
            return;
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

    rootContainer: {
        paddingTop: "3%",
        flex: 4,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: dark.theme.darkBlue1,
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
        height: "100px",
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
