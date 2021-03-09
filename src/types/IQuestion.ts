import { IChoice } from "./IChoice";

export type IQuestion = {
    id?: string;
    type: string;
    question: string;
    choices: IChoice;
    solution: string;
};
