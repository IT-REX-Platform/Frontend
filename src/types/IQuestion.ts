import { QuestionTypes } from "../constants/QuestionTypes";
import { IChoices } from "./IChoices";
import { ISolutionMultipleChoice, ISolutionNumeric } from "./ISolution";

interface IQuestion {
    id?: string;
    courseID?: string;
    question: string;
    type: QuestionTypes;
}

export interface IQuestionSingleChoice extends IQuestion {
    choices: IChoices;
    solution: string;
}

export interface IQuestionMultipleChoice extends IQuestion {
    choices: IChoices;
    solution: ISolutionMultipleChoice;
}

export interface IQuestionNumeric extends IQuestion {
    solution: ISolutionNumeric;
}
