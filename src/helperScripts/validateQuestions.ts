/* eslint-disable complexity */
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
): IQuestionNumeric | undefined {
    const toast: ToastService = new ToastService();

    if (questionText == undefined || questionText === i18n.t("itrex.addQuestionText")) {
        toast.warn(i18n.t("itrex.invalidQuestion"));
        return;
    }

    if (numberSolution == undefined) {
        toast.warn(i18n.t("itrex.invalidNumericSolution"));
        return;
    }

    if (epsilonSolution == undefined) {
        toast.warn(i18n.t("itrex.invalidEpsilon"));
        return;
    }

    const myNewQuestion: IQuestionNumeric = {
        courseId: "",
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
    courseId: string | undefined,
    questionText: string | undefined,
    choices: IChoices | undefined,
    solution: string | undefined
): IQuestionSingleChoice | undefined {
    const toast: ToastService = new ToastService();

    if (courseId === undefined) {
        return;
    }

    if (questionText === undefined || questionText === i18n.t("itrex.addQuestionText")) {
        toast.warn(i18n.t("itrex.invalidQuestion"));
        return;
    }

    if (choices == undefined) {
        toast.warn(i18n.t("itrex.invalidAnswers"));
        return;
    }
    if (
        choices["0"] == undefined ||
        choices["1"] == undefined ||
        choices["2"] == undefined ||
        choices["3"] == undefined
    ) {
        toast.warn(i18n.t("itrex.missingAnswers"));
        return;
    }

    if (solution == undefined) {
        toast.warn(i18n.t("itrex.invalidSingleSolution"));
        return;
    }

    const myNewQuestion: IQuestionSingleChoice = {
        courseId: "",
        type: QuestionTypes.SINGLE_CHOICE,
        question: questionText,
        choices: choices,
        solution: solution,
    };

    return myNewQuestion;
}

export function validateMultipleChoiceQuestion(
    courseId: string | undefined,
    questionText: string | undefined,
    choices: IChoices | undefined,
    solution: ISolutionMultipleChoice | undefined
): IQuestionMultipleChoice | undefined {
    const toast: ToastService = new ToastService();

    if (courseId === undefined) {
        return;
    }

    if (questionText == undefined || questionText === i18n.t("itrex.addQuestionText")) {
        toast.warn(i18n.t("itrex.invalidQuestion"));
        return;
    }

    if (choices == undefined) {
        toast.warn(i18n.t("itrex.invalidAnswers"));
        return;
    }
    if (
        choices["0"] == undefined ||
        choices["1"] == undefined ||
        choices["2"] == undefined ||
        choices["3"] == undefined
    ) {
        toast.warn(i18n.t("itrex.missingAnswers"));
        return;
    }

    if (solution == undefined) {
        toast.warn(i18n.t("itrex.invalidSingleSolution"));
        return;
    }

    const myNewQuestion: IQuestionMultipleChoice = {
        courseId: "",
        type: QuestionTypes.MULTIPLE_CHOICE,
        question: questionText,
        choices: choices,
        solution: solution,
    };

    return myNewQuestion;
}
