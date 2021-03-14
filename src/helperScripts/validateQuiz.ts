import i18n from "../locales";
import { ToastService } from "../services/toasts/ToastService";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../types/IQuestion";
import { IQuiz } from "../types/IQuiz";

// eslint-disable-next-line complexity
export function validateQuiz(
    quizName: string | undefined,
    quizQuestionObjects: Array<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
): boolean | IQuiz | undefined {
    const toast: ToastService = new ToastService();

    if (quizName == undefined || quizName.length === 0) {
        toast.error(i18n.t("itrex.invalidQuizName"));
        return false;
    }

    if (quizQuestionObjects == undefined || quizQuestionObjects.length === 0) {
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
