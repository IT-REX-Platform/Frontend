import { IQuestion } from "./IQuestion";

export type IQuiz = {
    id?: string;
    name?: string;
    questionObjects?: IQuestion[];
};
