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

//================= MULTIPLE CHOICE QUESTION ===============
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
questions.push(questionNumeric);

//================= QUIZ ===================================
const testQuiz: IQuiz = {
    id: "TEST01",
    name: "Chapter 01 - Quiz",
    questionObjects: questions,
};
export const quizList: IQuiz[] = [testQuiz];
