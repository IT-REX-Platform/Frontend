import i18n from "../locales";
import { ToastService } from "../services/toasts/ToastService";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../types/IQuestion";
import { IQuiz } from "../types/IQuiz";

// eslint-disable-next-line complexity
export function validateQuiz(
    courseId: string | undefined,
    quizName: string | undefined,
    quizQuestionObjects: Array<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>
): IQuiz | undefined {
    const toast: ToastService = new ToastService();

    if (courseId === undefined) {
        toast.error(i18n.t("itrex.invalidQuizCourseID"));
        return;
    }

    if (quizName == undefined || quizName.length === 0) {
        toast.success("dskfhsjf ");
        toast.error(i18n.t("itrex.invalidQuizName"));
        return;
    }

    if (quizQuestionObjects == undefined || quizQuestionObjects.length === 0) {
        toast.error(i18n.t("itrex.invalidQuestionsObject"));
        return;
    }

    const myNewQuiz: IQuiz = {
        courseId: courseId,
        name: quizName,
        questions: quizQuestionObjects,
    };

    return myNewQuiz;
}
