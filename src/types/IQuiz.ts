import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "./IQuestion";

export type IQuiz = {
    id?: string;
    name: string;
    questionObjects: (IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[];
};
