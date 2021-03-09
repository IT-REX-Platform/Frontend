import { IChoice } from "../../types/IChoice";
import { IQuestion } from "../../types/IQuestion";
import { IQuiz } from "../../types/IQuiz";

const choice: IChoice = {
    "0": "42",
    "1": "4",
    "2": "8",
    "3": "4",
};

const question: IQuestion = {
    id: "uuid",
    type: "SINGLE_CHOICE",
    question: "Was ist 2+2?",
    choices: choice,
    solution: "3",
};
const question2: IQuestion = {
    id: "uuid3",
    type: "SINGLE_CHOICE",
    question: "Was ist 4+4?",
    choices: choice,
    solution: "2",
};

const questions: IQuestion[] = [question, question2];
questions.push(question);
questions.push(question2);

const testQuiz: IQuiz = {
    id: "TEST01",
    name: "Chapter 01 - Quiz",
    questionObjects: questions,
};

export const quizList: IQuiz[] = [testQuiz];
