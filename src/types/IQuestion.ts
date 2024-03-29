import { QuestionTypes } from "../constants/QuestionTypes";
import { IChoices } from "./IChoices";
import { ISolutionMultipleChoice, ISolutionNumeric } from "./ISolution";

interface IQuestion {
    id?: string;
    courseId: string;
    quizIds?: string[];
    question: string;
}

export interface IQuestionSingleChoice extends IQuestion {
    type: QuestionTypes.SINGLE_CHOICE;
    choices: IChoices;
    solution: number;
    userInput?: number;
}

export interface IQuestionMultipleChoice extends IQuestion {
    type: QuestionTypes.MULTIPLE_CHOICE;
    choices: IChoices;
    solution: ISolutionMultipleChoice;
    userInput?: ISolutionMultipleChoice;
}

export interface IQuestionNumeric extends IQuestion {
    type: QuestionTypes.NUMERIC;
    solution: ISolutionNumeric;
    userInput?: number;
}
