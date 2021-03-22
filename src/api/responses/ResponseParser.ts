/* eslint-disable max-lines */
/* eslint-disable complexity */
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { IUser } from "../../types/IUser";
import { IChapter } from "../../types/IChapter";
import { ToastService } from "../../services/toasts/ToastService";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";
import { IQuiz } from "../../types/IQuiz";
import { IContent } from "../../types/IContent";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { loggerFactory } from "../../../logger/LoggerConfig";

export class ResponseParser {
    private loggerApi;
    private toast: ToastService;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParser");
        this.toast = new ToastService();
    }

    public parseCourses(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<ICourse[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((courses: ICourse[]) => {
                    for (const course of courses) {
                        course.startDate = this._parseDate(course.startDate);
                        course.endDate = this._parseDate(course.endDate);
                    }

                    this._toastSuccess(successMsg);
                    resolve(courses);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing courses: " + error.message);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseCourse(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((course: ICourse) => {
                    course.startDate = this._parseDate(course.startDate);
                    course.endDate = this._parseDate(course.endDate);

                    // Convert date of the TimePeriods
                    if (course.timePeriods != undefined) {
                        for (const timePeriod of course.timePeriods) {
                            timePeriod.startDate = this._parseDate(timePeriod.startDate);
                            timePeriod.endDate = this._parseDate(timePeriod.endDate);
                        }
                    }

                    // Convert date of the TimePeriods
                    if (course.timePeriods !== undefined) {
                        for (const timePeriod of course.timePeriods) {
                            timePeriod.startDate = timePeriod.startDate ? new Date(timePeriod.startDate) : undefined;
                            timePeriod.endDate = timePeriod.endDate ? new Date(timePeriod.endDate) : undefined;
                        }
                    }

                    this._toastSuccess(successMsg);
                    resolve(course);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing course: " + error.message);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseChapters(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IChapter[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const chapters = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(chapters);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapters: " + error.message);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseChapter(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IChapter> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const chapter = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(chapter);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapter: " + error.message);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseContentReferences(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContent[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const contents = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(contents);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing contents: " + error.message);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseContentReference(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContent> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const content = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(content);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing content: " + error.message);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseUserInfo(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IUser> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const user = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(user);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing user info: " + error.message);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseVideos(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IVideo[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((videos: IVideo[]) => {
                    for (const video of videos) {
                        video.startDate = this._parseDate(video.startDate);
                        video.endDate = this._parseDate(video.endDate);
                    }

                    this._toastSuccess(successMsg);
                    resolve(videos);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing videos: " + error.message);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseVideoMap(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<Map<string, IVideo>> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((videoMap: Map<string, IVideo>) => {
                    for (const [, video] of Array.from(videoMap.entries())) {
                        video.startDate = this._parseDate(video.startDate);
                        video.endDate = this._parseDate(video.endDate);
                    }

                    this._toastSuccess(successMsg);
                    resolve(videoMap);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing videos: " + error.message);
                    this._toastError(errorMsg);
                    resolve(new Map<string, IVideo>());
                });
        });
    }

    public parseVideo(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string,
        toastTimeout?: false
    ): Promise<IVideo> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((video: IVideo) => {
                    video.startDate = this._parseDate(video.startDate);
                    video.endDate = this._parseDate(video.endDate);
                    this._toastSuccess(successMsg, toastTimeout);
                    resolve(video);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing video: " + error.message);
                    this._toastError(errorMsg, toastTimeout);
                    resolve({});
                });
        });
    }

    public parseContentProgressTracker(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IContentProgressTracker> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((contentProgressTracker: IContentProgressTracker) => {
                    this._toastSuccess(successMsg);
                    resolve(contentProgressTracker);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing content progress tracker.", error);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseCourseProgressTracker(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<ICourseProgressTracker> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((courseProgressTracker: ICourseProgressTracker) => {
                    this._toastSuccess(successMsg);
                    resolve(courseProgressTracker);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing course data.", error);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseQuizzes(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IQuiz[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const quizzes = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(quizzes);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing quizzes: " + error.message);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseQuiz(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IQuiz | undefined> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const quiz = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(quiz);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing quiz: " + error.message);
                    this._toastError(errorMsg);
                    resolve(undefined);
                });
        });
    }

    public parseQuestions(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<(IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric)[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const questions = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(questions);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing questions: " + error.message);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseQuestion(
        response: Promise<Response>,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric | undefined> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const question = this._parseAsJson(response);
                    this._toastSuccess(successMsg);
                    resolve(question);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing question: " + error.message);
                    this._toastError(errorMsg);
                    resolve(undefined);
                });
        });
    }

    public checkEmptyResponse(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<void> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        // this._checkErrorCode(response);
                        throw new Error("HTTP error: " + response.status);
                    }

                    this._toastSuccess(successMsg);
                    resolve();
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing empty response: " + error.message);
                    this._toastError(errorMsg);
                    resolve();
                });
        });
    }

    private _parseAsJson(response: Response) {
        if (!response.ok) {
            // this._checkErrorCode(response);
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }

    // // eslint-disable-next-line complexity
    // private _checkErrorCode(response: Response): void {
    //     switch (response.status) {
    //         case 400:
    //             this.toast.error(i18n.t("itrex.badRequest"));
    //             throw new Error("Bad request error: " + response.status);
    //         case 404:
    //             this.toast.error(i18n.t("itrex.notFound"));
    //             throw new Error("Not found error: " + response.status);
    //         case 500:
    //             this.toast.error(i18n.t("itrex.internalServerError"));
    //             throw new Error("Internal server error: " + response.status);
    //         case 504:
    //             this.toast.error(i18n.t("itrex.timeoutRequest"));
    //             throw new Error("Request timeout error: " + response.status);
    //         default:
    //             this.toast.error(i18n.t("itrex.errorOccured"));
    //             throw new Error("HTTP error: " + response.status);
    //     }
    // }

    private _parseDate(date?: Date): Date | undefined {
        return date ? new Date(date) : undefined;
    }

    private _toastSuccess(successMsg?: string, toastTimeout?: false) {
        if (successMsg != undefined) {
            this.toast.success(successMsg, toastTimeout);
        }
    }

    private _toastError(errorMsg?: string, toastTimeout?: false) {
        if (errorMsg != undefined) {
            this.toast.error(errorMsg, toastTimeout);
        }
    }
}
