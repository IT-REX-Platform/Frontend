import {
    questionMultipleChoice,
    questionNumeric,
    questionSingleChoice,
    quizList,
    solutionMultipleChoice,
} from "../../src/constants/fixtures/quizzes.fixture";
import {
    clearQuizEntries,
    correctlySolved,
    correctnessPercentage,
    isNumericResultCorrect,
} from "../../src/helperScripts/solveQuizHelpers";
import { IQuestionNumeric } from "../../src/types/IQuestion";
import { IQuiz } from "../../src/types/IQuiz";

afterEach(() => {
    clearQuizEntries(quizList[0]);
});

describe("test clearQuizEntries", () => {
    it("should remove set userInput", () => {
        const quiz: IQuiz = quizList[0];
        expect(quiz.questions[0].userInput).toBeUndefined();
        quiz.questions[0].userInput = { 0: true };
        expect(quiz.questions[0].userInput).toBeDefined();
        expect(quiz.questions[0].userInput[0]).toBeTruthy();
        clearQuizEntries(quiz);
        expect(quiz.questions[0].userInput).toBeUndefined();
    });
});

describe("test correctnessPercentage", () => {
    it("should return 0 for no solved questions", () => {
        const quiz: IQuiz = quizList[0];

        const result = correctnessPercentage(quiz);

        expect(result).toBe(0);
    });
    it("should return 100 for all correctly solved questions", () => {
        // Only test with first question from quiz
        const quiz: IQuiz = {
            questions: [questionSingleChoice, questionMultipleChoice, questionNumeric],
            name: "testQuiz",
            courseId: "testCourse",
        };
        // Set correct answers for the questions
        quiz.questions[0].userInput = 3;
        quiz.questions[1].userInput = solutionMultipleChoice;
        quiz.questions[2].userInput = 3.1412;

        const result = correctnessPercentage(quiz);

        expect(result).toBe(100);
    });
});

describe("test correctlySolved", () => {
    it("should return 0 for no solved questions", () => {
        const quiz: IQuiz = quizList[0];

        const result = correctlySolved(quiz);

        expect(result).toBe(0);
    });
    it("should return 100 for all correctly solved questions", () => {
        // Only test with first question from quiz
        const quiz: IQuiz = {
            questions: [questionSingleChoice, questionMultipleChoice, questionNumeric],
            name: "testQuiz",
            courseId: "testCourse",
        };
        // Set correct answers for the questions
        quiz.questions[0].userInput = 3;
        quiz.questions[1].userInput = solutionMultipleChoice;
        quiz.questions[2].userInput = 3.1412;

        const result = correctlySolved(quiz);

        expect(result).toBe(3);
    });
});

describe("test isNumericResultCorrect", () => {
    it("should return false for undefined input", () => {
        const result = isNumericResultCorrect(questionNumeric);

        expect(result).toBeFalsy();
    });
    it("should return false for wrong input", () => {
        const questionWithWrongResult: IQuestionNumeric = questionNumeric;
        questionWithWrongResult.userInput = 0.0;
        const result = isNumericResultCorrect(questionWithWrongResult);

        expect(result).toBeFalsy();
    });
    it("should return true for correct input", () => {
        const questionWithCorrectResult: IQuestionNumeric = questionNumeric;
        questionWithCorrectResult.userInput = 3.141;
        const result = isNumericResultCorrect(questionWithCorrectResult);

        expect(result).toBeTruthy();
    });
});
