import { IQuiz } from "../../types/IQuiz";

/**
 * Wrapper for endpoints in backend quiz-service QuizResource.java.
 */
export interface IEndpointsQuiz {
    getAllQuizzes(getRequest: RequestInit, chapterId: string): Promise<IQuiz[]>;
    getQuiz(getRequest: RequestInit, quizId: string): Promise<IQuiz>;
    createQuiz(postRequest: RequestInit): Promise<IQuiz>;
    updateQuiz(putRequest: RequestInit): Promise<IQuiz>;
    patchQuiz(patchRequest: RequestInit): Promise<IQuiz>;
    deleteQuiz(deleteRequest: RequestInit, quizId: string): Promise<void>;
}
