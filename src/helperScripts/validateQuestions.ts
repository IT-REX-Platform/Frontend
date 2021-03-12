/* eslint-disable complexity */
import { toast } from "react-toastify";
import { QuestionTypes } from "../constants/QuestionTypes";
import i18n from "../locales";
import { ToastService } from "../services/toasts/ToastService";
import { IChoices } from "../types/IChoices";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../types/IQuestion";
import { ISolutionMultipleChoice } from "../types/ISolution";

export function validateNumericQuestion(
    questionText: string | undefined,
    epsilonSolution: number | undefined,
    numberSolution: number | undefined
): boolean | IQuestionNumeric | undefined {
    const toast: ToastService = new ToastService();

    if (questionText === undefined || questionText === i18n.t("itrex.addQuestion")) {
        toast.warn(i18n.t("itrex.invalidQuestion"));
        return false;
    }

    if (numberSolution == null || numberSolution === undefined) {
        toast.warn(i18n.t("itrex.invalidNumericSolution"));
        return false;
    }

    if (epsilonSolution == null || epsilonSolution === undefined) {
        toast.warn(i18n.t("itrex.invalidEpsilon"));
        return false;
    }

    const myNewQuestion: IQuestionNumeric = {
        type: QuestionTypes.NUMERIC,
        question: questionText,
        solution: {
            epsilon: epsilonSolution,
            result: numberSolution,
        },
    };

    return myNewQuestion;
}

export function validateSingleChoiceQuestion(
    questionText: string | undefined,
    choices: IChoices | undefined,
    solution: string | undefined
): boolean | IQuestionSingleChoice | undefined {
    if (questionText === undefined || questionText === i18n.t("itrex.addQuestion")) {
        toast.warn(i18n.t("itrex.invalidQuestion"));
        return false;
    }

    if (choices === undefined) {
        toast.warn(i18n.t("itrex.invalidAnswers"));
        return false;
    }
    if (
        choices["0"] === undefined ||
        choices["1"] === undefined ||
        choices["2"] === undefined ||
        choices["3"] === undefined
    ) {
        toast.warn(i18n.t("itrex.missingAnswers"));
        return false;
    }

    if (solution === undefined || solution === null) {
        toast.warn(i18n.t("itrex.invalidSingleSolution"));
        return false;
    }

    const myNewQuestion: IQuestionSingleChoice = {
        type: QuestionTypes.SINGLE_CHOICE,
        question: questionText,
        choices: choices,
        solution: "3",
    };

    return myNewQuestion;
}

export function validateMultipleChoiceQuestion(
    questionText: string | undefined,
    choices: IChoices | undefined,
    solution: ISolutionMultipleChoice | undefined
): boolean | IQuestionMultipleChoice | undefined {
    if (questionText === undefined || questionText === i18n.t("itrex.addQuestion")) {
        toast.warn(i18n.t("itrex.invalidQuestion"));
        return false;
    }

    if (choices === undefined) {
        toast.warn(i18n.t("itrex.invalidAnswers"));
        return false;
    }
    if (
        choices["0"] === undefined ||
        choices["1"] === undefined ||
        choices["2"] === undefined ||
        choices["3"] === undefined
    ) {
        toast.warn(i18n.t("itrex.missingAnswers"));
        return false;
    }

    if (solution === undefined || solution === null) {
        toast.warn(i18n.t("itrex.invalidSingleSolution"));
        return false;
    }

    const myNewQuestion: IQuestionMultipleChoice = {
        type: QuestionTypes.MULTIPLE_CHOICE,
        question: questionText,
        choices: choices,
        solution: solution,
    };

    return myNewQuestion;
}
