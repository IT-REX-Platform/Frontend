import { CompositeNavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, TextInput, Text } from "react-native";
import { dark } from "../../../../constants/themes/dark";
import { LocalizationContext } from "../../../Context";
import { IChapter } from "../../../../types/IChapter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../../../../locales";
import { QuestionTypes } from "../../../../constants/QuestionTypes";

import Select from "react-select";
import { ISolutionMultipleChoice, ISolutionNumeric } from "../../../../types/ISolution";
import { IChoices } from "../../../../types/IChoices";
import { NumericQuestion } from "./NumericQuestion";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { IQuiz } from "../../../../types/IQuiz";
import { CourseStackParamList, RootDrawerParamList } from "../../../../constants/navigators/NavigationRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
    quiz: IQuiz;
}

type ScreenCourseTabsNavigationProp = CompositeNavigationProp<
    StackNavigationProp<CourseStackParamList, "CREATE_QUESTION">,
    DrawerNavigationProp<RootDrawerParamList>
>;

type ScreenCourseTabsRouteProp = RouteProp<CourseStackParamList, "CREATE_QUESTION">;

export const ScreenAddQuestion: React.FC<ChapterComponentProps> = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation<ScreenCourseTabsNavigationProp>();

    const [questionText, setQuestionText] = useState<string>(i18n.t("itrex.addQuestionText"));
    const route = useRoute<ScreenCourseTabsRouteProp>();
    const quizTemp = route.params.quiz;
    const [quiz, setQuiz] = useState<IQuiz | undefined>(quizTemp);

    console.log(quiz);

    const kindOfQuestionOptions = [
        { value: QuestionTypes.MULTIPLE_CHOICE, label: "Multiple Choice" },
        { value: QuestionTypes.SINGLE_CHOICE, label: "Single Choice" },
        { value: QuestionTypes.NUMERIC, label: "Numeric" },
    ];

    const [solutionNum, setSolutionNum] = useState<ISolutionNumeric>();
    const [solutionMultiChoice, setsolutionMultiChoice] = useState<ISolutionMultipleChoice>();
    const [solutionSingleChoice, setSolutionSingleChoice] = useState<IChoices>();

    // Make Single Choice default
    const defaultKindOfQuestionValue = kindOfQuestionOptions[1];
    const [selectedKindOfQuestion, setKindOfQuestion] = useState<QuestionTypes | undefined>(
        defaultKindOfQuestionValue.value
    );

    useFocusEffect(
        React.useCallback(() => {
            setKindOfQuestion(selectedKindOfQuestion);
            // AuthenticationService.getInstance().getUserInfo(setUserInfo);
        }, [selectedKindOfQuestion, solutionNum, solutionMultiChoice, solutionSingleChoice])
    );

    return (
        <ImageBackground source={require("../../../../constants/images/Background1-1.png")} style={styles.image}>
            <View style={[styles.headContainer]}>
                <View style={styles.borderContainer}>
                    <TextInput
                        style={styles.questionInput}
                        value={questionText}
                        onChangeText={(text) => setQuestionText(text)}
                        multiline={true}
                    />
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                </View>
            </View>
            {selectKindOfQuestion()}
            {setInputFields()}
        </ImageBackground>
    );

    function selectKindOfQuestion() {
        return (
            <View style={styles.card}>
                <Text style={styles.cardHeader}>{i18n.t("itrex.kindOfQuestion")}</Text>
                <View style={styles.filterContainer}>
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

    function setInputFields() {
        if (selectedKindOfQuestion === QuestionTypes.NUMERIC) {
            console.log(quiz);
            return <NumericQuestion question={questionText} quiz={quiz} />;
        } else if (selectedKindOfQuestion === QuestionTypes.SINGLE_CHOICE) {
            return <SingleChoiceQuestion question={questionText} quiz={quiz} />;
        } else if (selectedKindOfQuestion === QuestionTypes.MULTIPLE_CHOICE) {
            return <MultipleChoiceQuestion question={questionText} quiz={quiz} />;
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
    borderContainer: {
        height: 100,
        flex: 3,
        flexDirection: "row",
        borderBottomColor: "rgba(70,74,91,0.5)",
        borderBottomWidth: 3,
    },
    icon: {
        position: "relative",
        alignItems: "flex-start",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    questionInput: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        width: "100%",
        height: "90%",
        margin: 2,
        padding: 5,
        borderColor: "white",
        borderStyle: "dotted",
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
    },
    card: {
        marginTop: 20,
        maxWidth: "50%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: dark.Opacity.grey,
    },
    cardHeader: {
        padding: 16,
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        flexGrow: 1,
    },
    filterContainer: {
        flexGrow: 4,
        flexDirection: "row",
        flexWrap: "nowrap",
    },
});