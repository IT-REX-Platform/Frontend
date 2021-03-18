import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Animated, FlatList, ImageBackground, Platform, Text, TouchableOpacity, View } from "react-native";
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { EndpointsQuiz } from "../../api/endpoints/EndpointsQuiz";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { ICourse } from "../../types/ICourse";
import { IQuiz } from "../../types/IQuiz";
import { CourseContext, LocalizationContext } from "../Context";
import { TextButton } from "../uiElements/TextButton";
import { contentPoolStyles } from "./contentPoolStyles";

const endpointsQuiz = new EndpointsQuiz();

const translateY = new Animated.Value(100);
export const QuizPoolComponent: React.FC = () => {
    // Navigation hook.
    const navigation = useNavigation();

    // Get localization from context.
    React.useContext(LocalizationContext);

    const initialQuizzes: IQuiz[] = [];
    const [quizzes, setQuizzes] = useState(initialQuizzes); // Vertical slide animation for FlatList.
    Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: false }).start();

    // Get course infos from context.
    const course: ICourse = React.useContext(CourseContext);
    console.log(course);

    // Call following function/s only once when this screen is shown.
    useFocusEffect(
        React.useCallback(() => {
            _getAllQuizzes();
            console.log(quizzes);
        }, [course])
    );

    function renderQuizCreation() {
        return (
            <View style={contentPoolStyles.addContentContainer}>
                <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.quizProperties")}</Text>

                <TextButton
                    title={i18n.t("itrex.createQuiz")}
                    onPress={() => {
                        console.log("Create Quiz");
                        navigation.navigate("CREATE_QUIZ");
                    }}
                />
            </View>
        );
    }

    // Render UI for quiz list according to un-/available quiz data.
    const renderQuizList = () => {
        return (
            <View style={contentPoolStyles.contentListContainer}>
                <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                    <FlatList
                        style={contentPoolStyles.contentList}
                        showsVerticalScrollIndicator={false}
                        data={quizzes}
                        renderItem={renderQuizListItem}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={_quizListLinesToRender()}
                        ListEmptyComponent={renderEmptyList}
                    />
                </Animated.View>
            </View>
        );
    };

    // Creation of each item of quiz list.
    const renderQuizListItem = ({ item }: { item: IQuiz }) => (
        <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
                console.log(item);
                navigation.navigate("CREATE_QUIZ", {
                    quiz: item,
                    courseId: course.id,
                });
            }}>
            <ListItem
                containerStyle={{
                    marginBottom: 5,
                    backgroundColor: dark.theme.darkBlue2,
                    borderColor: dark.theme.darkBlue4,
                    borderWidth: 2,
                    borderRadius: 5,
                    maxWidth: 400,
                }}>
                <MaterialCommunityIcons name="file-question-outline" size={28} color="white" />

                <ListItem.Content>
                    <ListItem.Title style={contentPoolStyles.listItemTitle} numberOfLines={2} lineBreakMode="tail">
                        {item.name}
                    </ListItem.Title>
                    <ListItem.Subtitle
                        style={contentPoolStyles.listItemSubtitle}
                        numberOfLines={1}
                        lineBreakMode="tail">
                        {i18n.t("itrex.questions")} {item.questions.length}
                    </ListItem.Subtitle>
                </ListItem.Content>

                <TouchableOpacity style={contentPoolStyles.deleteButton} onPress={() => _deleteQuiz(item.id)}>
                    <MaterialCommunityIcons style={contentPoolStyles.deleteIcon} name="delete" size={32} color="red" />
                </TouchableOpacity>

                <ListItem.Chevron color="white" />
            </ListItem>
        </TouchableOpacity>
    );

    // Info that the list is empty.
    const renderEmptyList = () => {
        return (
            <View style={contentPoolStyles.infoTextBox}>
                <Text style={contentPoolStyles.infoText}>{i18n.t("itrex.noQuizzesAvailable")}</Text>
            </View>
        );
    };

    return (
        <ImageBackground
            source={require("../../constants/images/Background2.png")}
            style={contentPoolStyles.imageContainer}>
            <Text style={contentPoolStyles.header}>{i18n.t("itrex.quizPool")}</Text>
            {renderQuizCreation()}
            {renderQuizList()}
        </ImageBackground>
    );

    function _quizListLinesToRender(): number {
        if (Platform.OS === "web") {
            return 50;
        }
        return 3;
    }

    /**
     * Get a list of all quizzes
     */
    async function _getAllQuizzes(): Promise<void> {
        if (course.id == undefined) {
            return;
        }

        setQuizzes(initialQuizzes);

        const request: RequestInit = RequestFactory.createGetRequest();
        const response = endpointsQuiz.getCourseQuizzes(request, course.id);
        response.then((courseQuizzes: IQuiz[]) => {
            setQuizzes(courseQuizzes);
            console.log(courseQuizzes);
        });
    }

    /**
     * Delete a specifix quiz with it's id. Update the Quizzes list afterwards.
     *
     * @param quizId id of the quiz to delete
     * @returns
     */
    async function _deleteQuiz(quizId?: string): Promise<void> {
        if (quizId === undefined) {
            return;
        }

        const request: RequestInit = RequestFactory.createDeleteRequest();
        const response = endpointsQuiz.deleteQuiz(request, quizId, undefined);
        response.then(() => _getAllQuizzes());
    }
};
