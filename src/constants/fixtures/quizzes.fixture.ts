import { IChoices as IChoices } from "../../types/IChoices";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { IQuiz } from "../../types/IQuiz";
import { ISolutionMultipleChoice, ISolutionNumeric } from "../../types/ISolution";
import { QuestionTypes } from "../QuestionTypes";

//================= SINGLE CHOICE QUESTION =================
const choicesSingleChoice: IChoices = {
    "0": "0",
    "1": "1",
    "2": "42",
    "3": "4",
};
const questionSingleChoice: IQuestionSingleChoice = {
    id: "uuid_1",
    type: QuestionTypes.SINGLE_CHOICE,
    question: "Was ist 2+2?",
    choices: choicesSingleChoice,
    solution: "3",
};

//================= MULTIPLE CHOICE QUESTION ===============
const choicesMultipleChoice: IChoices = {
    "0": "Januar",
    "1": "Februar",
    "2": "Mai",
    "3": "August",
};
const solutionMultipleChoice: ISolutionMultipleChoice = {
    "0": true,
    "1": true,
    "2": false,
    "3": false,
};
const questionMultipleChoice: IQuestionMultipleChoice = {
    id: "uuid_2",
    type: QuestionTypes.MULTIPLE_CHOICE,
    question: "Welche Monate haben ein r im Namen?",
    choices: choicesMultipleChoice,
    solution: solutionMultipleChoice,
};

const question3: IQuestionSingleChoice = {
    id: "uuid4",
    type: QuestionTypes.SINGLE_CHOICE,
    question: "Was ist 21+21?",
    choices: choicesSingleChoice,
    solution: "0",
};

const question4: IQuestionSingleChoice = {
    id: "uuid5",
    type: QuestionTypes.SINGLE_CHOICE,
    question: "Was ist 50+6?",
    choices: choicesSingleChoice,
    solution: "1",
};

const question5: IQuestionSingleChoice = {
    id: "uuid6",
    type: QuestionTypes.SINGLE_CHOICE,
    question: "Das ist eine gaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaanz lange Fraaaaaaaage",
    choices: choicesSingleChoice,
    solution: "1",
};

//================= NUMERIC QUESTION ===============
const solutionNumeric: ISolutionNumeric = {
    result: 3.1412,
    epsilon: 0.1,
};
const questionNumeric: IQuestionNumeric = {
    id: "uuid_3",
    type: QuestionTypes.NUMERIC,
    question: "What is pi?",
    solution: solutionNumeric,
};

//================= QUESTIONS ==============================
const questions: Array<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric> = [];
questions.push(questionSingleChoice);
questions.push(questionMultipleChoice);
questions.push(question3);
questions.push(question4);
questions.push(question5);
questions.push(questionNumeric);

//================= QUIZ ===================================
const testQuiz: IQuiz = {
    id: "TEST01",
    name: "Chapter 01 - Quiz",
    questionObjects: questions,
};
export const quizList: IQuiz[] = [testQuiz];
