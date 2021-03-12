import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "./IQuestion";

export type IQuiz = {
    id?: string;
    courseId: string;
    name: string;
    questions: (IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[];
};
