import { IChoice } from "../../types/IChoice";
import { IQuestion } from "../../types/IQuestion";
import { IQuiz } from "../../types/IQuiz";

const choice: IChoice = {
    "0": "42",
    "1": "56",
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
const question3: IQuestion = {
    id: "uuid4",
    type: "SINGLE_CHOICE",
    question: "Was ist 21+21?",
    choices: choice,
    solution: "0",
};

const question4: IQuestion = {
    id: "uuid5",
    type: "SINGLE_CHOICE",
    question: "Was ist 50+6?",
    choices: choice,
    solution: "1",
};

const question5: IQuestion = {
    id: "uuid6",
    type: "SINGLE_CHOICE",
    question: "Das ist eine gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaanz lange Fraaaaaaaage",
    choices: choice,
    solution: "1",
};

const questions: IQuestion[] = [question, question2, question3, question4, question5];

const testQuiz: IQuiz = {
    id: "TEST01",
    name: "Chapter 01 - Quiz",
    questionObjects: questions,
};

export const quizList: IQuiz[] = [testQuiz];
