/* eslint-disable complexity */
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../../../locales";
import { IQuestionNumeric } from "../../../types/IQuestion";
import { IQuiz } from "../../../types/IQuiz";
import { LocalizationContext } from "../../Context";
import { cardStyles } from "../cardStyles";

interface QuestionCardProps {
    question: IQuestionNumeric;
    quiz: IQuiz;
    courseId: string;
}

export const CreationNumericCard: React.FC<QuestionCardProps> = (props) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    const question = props.question;
    const quiz = props.quiz;
    const courseId = props.courseId;

    return (
        <TouchableOpacity
            style={cardStyles.card}
            onPress={() =>
                navigation.navigate("CREATE_QUESTION", { courseId: courseId, quiz: quiz, question: question })
            }>
            <MaterialCommunityIcons
                name="numeric"
                color="white"
                size={26}
                style={{ position: "absolute", margin: 8 }}
            />
            <Text style={cardStyles.cardHeader}>{question.question}</Text>
            <View style={cardStyles.break} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{renderChoices()}</View>
        </TouchableOpacity>
    );

    function renderChoices() {
        return (
            <View style={{ borderColor: "white", width: "50%" }}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>
                            <Text style={cardStyles.textChoice}>{i18n.t("itrex.category")}</Text>
                        </DataTable.Title>
                        <DataTable.Title numeric>
                            <Text style={cardStyles.textChoice}>{i18n.t("itrex.value")}</Text>
                        </DataTable.Title>
                    </DataTable.Header>

                    <DataTable.Row>
                        <DataTable.Cell>
                            <Text style={{ color: "white" }}>{i18n.t("itrex.result")}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <Text style={{ color: "white" }}>{question.solution.result}</Text>
                        </DataTable.Cell>
                    </DataTable.Row>

                    <DataTable.Row>
                        <DataTable.Cell>
                            <Text style={{ color: "white" }}>{i18n.t("itrex.epsilon")}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell numeric>
                            <Text style={{ color: "white" }}>{question.solution.epsilon}</Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            </View>
        );
    }
};
