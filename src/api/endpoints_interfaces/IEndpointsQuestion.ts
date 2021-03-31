import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";

/**
 * Wrapper for endpoints in backend quiz-service QuestionResource.java.
 */
export interface IEndpointsQuestion {
    getAllQuestions(
        getRequest: RequestInit
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]>;
    getCourseQuestions(
        getRequest: RequestInit,
        courseId: string
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]>;
    getQuestion(
        getRequest: RequestInit,
        questionId: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined>;
    findAllByIds(
        postRequest: RequestInit
    ): Promise<Map<string, IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric>>;
    createQuestion(
        postRequest: RequestInit
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined>;
    updateQuestion(
        putRequest: RequestInit
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined>;
    deleteQuestion(deleteRequest: RequestInit, questionId: string): Promise<void>;
}
