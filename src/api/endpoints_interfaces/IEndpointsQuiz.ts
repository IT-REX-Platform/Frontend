import { IQuiz } from "../../types/IQuiz";

/**
 * Wrapper for endpoints in backend quiz-service QuizResource.java.
 */
export interface IEndpointsQuiz {
    getAllQuizzes(getRequest: RequestInit): Promise<IQuiz[]>;
    getCourseQuizzes(getRequest: RequestInit, courseId: string): Promise<IQuiz[]>;
    getQuiz(getRequest: RequestInit, quizId: string): Promise<IQuiz>;
    createQuiz(postRequest: RequestInit): Promise<IQuiz>;
    updateQuiz(putRequest: RequestInit): Promise<IQuiz>;
    deleteQuiz(deleteRequest: RequestInit, quizId: string, withQuestions?: boolean): Promise<void>;
}
