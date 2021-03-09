import { IChoice } from "../../types/IChoice";
import { IQuestion } from "../../types/IQuestion";
import { IQuiz } from "../../types/IQuiz";

let choices: IChoice = {};

choices["1"] = "42";
choices["2"] = "4";
choices["3"] = "22";
choices["4"] = "33";

const question: IQuestion = [
    {
        id: "uuid",
        type: "SINGLE_CHOICE",
        question: "Was ist 2+2?",
        choices: choices,
        solution: "3",
    },
];

const testQuiz: IQuiz = {
    id: "TEST01",
    name: "Chapter 01 - Quiz",
    questionObjects: question,
};

export const quizList: IQuiz[] = [testQuiz];
