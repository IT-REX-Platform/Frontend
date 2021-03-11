/* eslint-disable complexity */
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, TextInput, Text } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { LocalizationContext } from "../../Context";
import { IChapter } from "../../../types/IChapter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextButton } from "../../uiElements/TextButton";
import { createAlert } from "../../../helperScripts/createAlert";
import i18n from "../../../locales";
import { IQuestionNumeric, IQuestionSingleChoice } from "../../../types/IQuestion";
import { QuestionTypes } from "../../../constants/QuestionTypes";
import * as NumericInput from "react-numeric-input";

import Select from "react-select";
import { ISolutionMultipleChoice, ISolutionNumeric } from "../../../types/ISolution";
import { IChoices } from "../../../types/IChoices";

interface ChapterComponentProps {
    chapter?: IChapter;
    chapterId?: string;
    editMode?: boolean;
}

export const ScreenAddQuestion: React.FC<ChapterComponentProps> = () => {
    React.useContext(LocalizationContext);
    const [questionText, setQuestionText] = useState<string>("Please add your question here.");

    const kindOfQuestionOptions = [
        { value: QuestionTypes.MULTIPLE_CHOICE, label: "Multiple Choice" },
        { value: QuestionTypes.SINGLE_CHOICE, label: "Single Choice" },
        { value: QuestionTypes.NUMERIC, label: "Numeric" },
    ];

    const [numberSolution, setNumberSolution] = useState<number | null>(5);
    const [epsilonSolution, setEpsilonSolution] = useState<number | null>(0.1);

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
        <ImageBackground source={require("../../../constants/images/Background1-1.png")} style={styles.image}>
            <View style={[styles.headContainer]}>
                <View style={styles.borderContainer}>
                    <TextInput
                        style={styles.quizHeader}
                        value={questionText}
                        onChangeText={(text) => setQuestionText(text)}
                    />
                    <MaterialCommunityIcons name="pen" size={24} color={dark.theme.darkGreen} style={styles.icon} />
                </View>
                <View>
                    <TextButton title={i18n.t("itrex.save")} onPress={() => saveQuestion()} />
                </View>
            </View>
            {selectKindOfQuestion()}
            {setInputFields()}
        </ImageBackground>
    );

    function selectKindOfQuestion() {
        return (
            <View style={styles.card}>
                <Text style={styles.cardHeader}>Kind of Question</Text>
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
            return (
                <>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 100 }}>
                        <View style={styles.contentContainer}>
                            <Text style={styles.textStyle}>Specify the numeric answer right here: </Text>
                            <NumericInput
                                step={0.1}
                                precision={2}
                                onChange={(number) => setNumberOfSolution(number)}
                                style={{
                                    input: {
                                        color: "white",
                                        background: dark.Opacity.darkBlue1,
                                        borderColor: dark.Opacity.darkBlue1,
                                        borderBlockColor: dark.Opacity.darkBlue1,
                                    },
                                }}
                            />
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.textStyle}>Specify the epsilon value right here: </Text>
                            <NumericInput
                                step={0.1}
                                precision={2}
                                onChange={(number) => setEpsilonSolution(number)}
                                style={{
                                    input: {
                                        color: "white",
                                        background: dark.Opacity.darkBlue1,
                                        borderColor: dark.Opacity.darkBlue1,
                                        borderBlockColor: dark.Opacity.darkBlue1,
                                    },
                                }}
                            />
                        </View>
                    </View>
                </>
            );
        } else if (
            selectedKindOfQuestion === QuestionTypes.SINGLE_CHOICE ||
            selectedKindOfQuestion === QuestionTypes.MULTIPLE_CHOICE
        ) {
            return (
                <>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 90 }}>
                        <Text style={styles.textStyle}>Specify the different choices here:</Text>
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                        <View style={styles.cardChoicesRight}>
                            <TextInput
                                editable
                                style={[styles.descriptionInput, styles.separator]}
                                onChangeText={(text: string) => addSolutionEntry("0", text)}
                                multiline={true}
                            />
                        </View>
                        <View style={styles.cardChoicesRight}>
                            <TextInput
                                editable
                                style={[styles.descriptionInput, styles.separator]}
                                onChangeText={(text: string) => addSolutionEntry("1", text)}
                                multiline={true}
                            />
                        </View>
                        <View style={styles.cardChoicesRight}>
                            <TextInput
                                editable
                                style={[styles.descriptionInput, styles.separator]}
                                onChangeText={(text: string) => addSolutionEntry("2", text)}
                                multiline={true}
                            />
                        </View>
                        <View style={styles.cardChoicesRight}>
                            <TextInput
                                editable
                                allowFontScaling={true}
                                style={[styles.descriptionInput, styles.separator]}
                                onChangeText={(text: string) => addSolutionEntry("3", text)}
                                multiline={true}
                            />
                        </View>
                    </View>
                </>
            );
        }
    }

    function setNumberOfSolution(solutionNumber: number | null) {
        setNumberSolution(solutionNumber);
    }

    function addSolutionEntry(index: string, text: string) {
        setSolutionSingleChoice((solutionSingleChoice) => ({ ...solutionSingleChoice, [index]: text }));
    }

    function saveQuestion() {
        createAlert("Save Question, Navigate back to Add-Quiz page and add this question to the list of questions ");
        // TODO: Save Question, Navigate back, show this question in add Quiz View
        // TODO: Verify if use added an other question text & answers & solutions & selected a answer type
        // TODO: confirm save

        if (selectedKindOfQuestion == QuestionTypes.SINGLE_CHOICE) {
            if (solutionSingleChoice === undefined || selectedKindOfQuestion === undefined) {
                return;
            }
            const myNewQuestion: IQuestionSingleChoice = {
                type: selectedKindOfQuestion,
                question: questionText,
                choices: solutionSingleChoice,
                solution: "3",
            };
            console.log(myNewQuestion);
        } else if (selectedKindOfQuestion == QuestionTypes.NUMERIC) {
            if (epsilonSolution === null || numberSolution === null) {
                return;
            }
            const myNewQuestion: IQuestionNumeric = {
                type: selectedKindOfQuestion,
                question: questionText,
                solution: {
                    epsilon: epsilonSolution,
                    result: numberSolution,
                },
            };
            console.log(myNewQuestion);
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
    cardChoicesRight: {
        margin: 8,
        minHeight: 100,
        maxHeight: 150,
        width: "40%",
        backgroundColor: dark.Opacity.grey,
        borderColor: dark.theme.lightBlue,
        borderWidth: 5,
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        color: "white",
    },
    descriptionInput: {
        width: "100%",
        height: "90%",
        margin: 2,
        padding: 5,
        fontSize: 16,
        color: "white",
        borderColor: "white",
        borderStyle: "dotted",
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
    },
    separator: {
        marginBottom: 20,
    },
    card: {
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
    textStyle: {
        color: "white",
        fontSize: 18,
    },
    contentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "80%",
        marginTop: 20,
    },
});
