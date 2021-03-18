import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    ImageBackground,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ListItem } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { EndpointsQuiz } from "../../api/endpoints/EndpointsQuiz";
import { EndpointsVideo } from "../../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { quizList } from "../../constants/fixtures/quizzes.fixture";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { ICourse } from "../../types/ICourse";
import { IQuiz } from "../../types/IQuiz";
import { CourseContext, LocalizationContext } from "../Context";
import { TextButton } from "../uiElements/TextButton";
import { videoPoolStyles } from "../videoPoolComponent/videoPoolStyles";

const endpointsVideo = new EndpointsVideo();
const endpointsQuiz = new EndpointsQuiz();
const loggerService = loggerFactory.getLogger("service.VideoPoolComponent");
const loggerUI = loggerFactory.getLogger("UI.VideoPoolComponent");

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
            loggerService.trace("EXECUTING THIS ONLY ONCE ON SCREEN FOCUS!");
            _getAllQuizzes();
            console.log(quizzes);
        }, [course])
    );

    function renderQuizCreation() {
        return (
            <View style={videoPoolStyles.videoUploadContainer}>
                <Text style={videoPoolStyles.infoText}>{i18n.t("itrex.quizProperties")}</Text>

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

    // Render UI for video list according to un-/available video data.
    const renderVideoList = () => {
        return (
            <View style={videoPoolStyles.videoListContainer}>
                {/* // flex: 1: makes the list scrollable
            // maxWidth: "95%": prevents list items from going beyond left-right screen borders */}
                <Animated.View style={{ transform: [{ translateY }], flex: 1, maxWidth: "95%" }}>
                    <FlatList
                        style={videoPoolStyles.videoList}
                        showsVerticalScrollIndicator={false}
                        data={quizzes}
                        renderItem={renderVideoListItem}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={_videoListLinesToRender()}
                        ListEmptyComponent={renderEmptyList}
                    />
                </Animated.View>
            </View>
        );
    };

    // Creation of each item of video list.
    const renderVideoListItem = ({ item }: { item: IQuiz }) => (
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
                }}>
                <MaterialCommunityIcons name="file-question-outline" size={28} color="white" />

                <ListItem.Content>
                    <ListItem.Title style={videoPoolStyles.listItemTitle} numberOfLines={1} lineBreakMode="tail">
                        {item.name}
                    </ListItem.Title>
                    <ListItem.Subtitle style={videoPoolStyles.listItemSubtitle} numberOfLines={1} lineBreakMode="tail">
                        Questions : {item.questions.length}
                    </ListItem.Subtitle>
                </ListItem.Content>

                <TouchableOpacity style={videoPoolStyles.deleteButton} onPress={() => _deleteQuiz(item.id)}>
                    <MaterialCommunityIcons style={videoPoolStyles.deleteIcon} name="delete" size={32} color="red" />
                </TouchableOpacity>

                <ListItem.Chevron color="white" />
            </ListItem>
        </TouchableOpacity>
    );

    // Info that the list is empty.
    const renderEmptyList = () => {
        return (
            <View style={videoPoolStyles.infoTextBox}>
                <Text style={videoPoolStyles.infoText}>Bisher wurden dem Quiz Pool noch keine Quizze hinzugefügt.</Text>
            </View>
        );
    };

    return (
        <ImageBackground
            source={require("../../constants/images/Background2.png")}
            style={videoPoolStyles.imageContainer}>
            <Text style={videoPoolStyles.header}>{i18n.t("itrex.quizPool")}</Text>
            {renderQuizCreation()}
            {renderVideoList()}
        </ImageBackground>
    );

    function _videoListLinesToRender(): number {
        if (Platform.OS === "web") {
            return 50;
        }
        return 3;
    }

    async function _getAllQuizzes(): Promise<void> {
        if (course.id == undefined) {
            loggerService.warn("Course ID undefined, can't get videos.");
            return;
        }
        loggerService.trace("Getting all videos of course: " + course.id);

        setQuizzes(initialQuizzes);

        const request: RequestInit = RequestFactory.createGetRequest();
        const response = endpointsQuiz.getCourseQuizzes(request, course.id, "OK", "ERROR");
        response.then((courseQuizzes: IQuiz[]) => {
            setQuizzes(courseQuizzes);
            console.log(courseQuizzes);
        });
    }

    async function _deleteQuiz(quizId?: string): Promise<void> {
        if (quizId === undefined) {
            return;
        }

        const request: RequestInit = RequestFactory.createDeleteRequest();
        const response = endpointsQuiz.deleteQuiz(request, quizId, undefined, "OK", "ERROR");
        response.then(() => _getAllQuizzes());
    }
};
