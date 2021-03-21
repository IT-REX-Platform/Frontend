import { QuestionTypes } from "../constants/QuestionTypes";
import { IQuestionNumeric } from "../types/IQuestion";
import { IQuiz } from "../types/IQuiz";

/**
 * Remove the userInput from a quiz Object
 *
 * @param quiz The quiz object you want to remove attached UserInput from
 */
export function clearQuizEntries(quiz: IQuiz): void {
    quiz.questions.map((question) => {
        question.userInput = undefined;
    });
}

/**
 * Get the percentage of correctly solved questions w.r.t all questions
 *
 * @param quiz The quiz object with attached UserInput
 * @returns percentage of correctly solved questions
 */
export function correctnessPercentage(quiz: IQuiz): number {
    const amountCorrectlySolved: number = correctlySolved(quiz);

    const percentage: number = (amountCorrectlySolved * 100) / quiz.questions.length;

    return Math.round(percentage);
}

/**
 * Get the amount of correctly solved questions as a number
 *
 * @param quiz The quiz object with attached UserInput
 * @returns number of correctly solved questions
 */
export function correctlySolved(quiz: IQuiz): number {
    let amountCorrectlySolved = 0;

    // eslint-disable-next-line complexity
    quiz.questions.map((question) => {
        switch (question.type) {
            case QuestionTypes.SINGLE_CHOICE:
                if (question.solution === question.userInput) {
                    amountCorrectlySolved += 1;
                }
                break;
            case QuestionTypes.MULTIPLE_CHOICE:
                if (JSON.stringify(question.solution) === JSON.stringify(question.userInput)) {
                    amountCorrectlySolved += 1;
                }
                break;
            case QuestionTypes.NUMERIC:
                if (isNumericResultCorrect(question)) {
                    amountCorrectlySolved += 1;
                }
        }
    });

    return amountCorrectlySolved;
}

/**
 * Find out if the provided UserInput is correct or not for this numeric question
 *
 * @param question The numeric question Object where userInput is attached to
 * @returns true if answer is correct, otherwise false
 */
export function isNumericResultCorrect(question: IQuestionNumeric): boolean {
    const correctSolution = question.solution.result;
    const acceptableEpsilon = question.solution.epsilon;
    const userInput = question.userInput;

    if (userInput === undefined) {
        return false;
    }
    if (userInput <= correctSolution + acceptableEpsilon && userInput >= correctSolution - acceptableEpsilon) {
        return true;
    }
    return false;
}
