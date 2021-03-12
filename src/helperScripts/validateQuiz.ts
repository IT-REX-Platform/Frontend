import i18n from "../locales";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../types/IQuestion";
import { toast } from "react-toastify";
import { IQuiz } from "../types/IQuiz";

// eslint-disable-next-line complexity
export function validateQuiz(
    quizName: string | undefined,
    quizQuestionObjects: Array<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
): boolean | IQuiz | undefined {
    if (quizName === undefined || quizName === null || quizName.length === 0) {
        toast.error(i18n.t("itrex.invalidQuizName"));
        return false;
    }

    if (quizQuestionObjects.length === 0 || quizQuestionObjects === undefined || quizQuestionObjects === null) {
        toast.error(i18n.t("itrex.invalidQuestionsObject"));
        return false;
    }

    const myNewQuiz: IQuiz = {
        // TODO Add ID
        courseId: "",
        name: quizName,
        questions: quizQuestionObjects,
    };

    return myNewQuiz;
}
