/* eslint-disable complexity */
import { loggerFactory } from "../../../logger/LoggerConfig";
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
                        course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                        course.endDate = course.endDate ? new Date(course.endDate) : undefined;
                    }

                    this._toastSuccess(successMsg);
                    resolve(courses);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing courses.", error);
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
                    course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                    course.endDate = course.endDate ? new Date(course.endDate) : undefined;

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
                    this.loggerApi.error("An error occurred while parsing course.", error);
                    this._toastError(errorMsg);
                    resolve({});
                });
        });
    }

    public parseChapters(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IChapter[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((chapters: IChapter[]) => {
                    this._toastSuccess(successMsg);
                    resolve(chapters);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapters.", error);
                    this._toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseChapter(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IChapter> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((chapter: IChapter) => {
                    this._toastSuccess(successMsg);
                    resolve(chapter);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapter.", error);
                    this._toastError(errorMsg);
                    resolve({});
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
                    return this._parseAsJson(response);
                })
                .then((content: IContent) => {
                    this._toastSuccess(successMsg);
                    resolve(content);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing content.", error);
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
                    return this._parseAsJson(response);
                })
                .then((contents: IContent[]) => {
                    this._toastSuccess(successMsg);
                    resolve(contents);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing contents.", error);
                    this._toastError(errorMsg);
                    resolve([]);
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
                    this.loggerApi.error("An error occurred while parsing user info.", error);
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
                        video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                        video.endDate = video.endDate ? new Date(video.endDate) : undefined;
                    }

                    this._toastSuccess(successMsg);
                    resolve(videos);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing videos.", error);
                    this._toastError(errorMsg);
                    resolve([]);
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
                    video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                    video.endDate = video.endDate ? new Date(video.endDate) : undefined;

                    this._toastSuccess(successMsg, toastTimeout);
                    resolve(video);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing video.", error);
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
                    this.loggerApi.error("An error occurred while parsing quizzes.", error);
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
                    this.loggerApi.error("An error occurred while parsing quiz.", error);
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
                    this.loggerApi.error("An error occurred while parsing questions.", error);
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
                    this.loggerApi.error("An error occurred while parsing question.", error);
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
                        this._checkResponseCode(response);
                    }

                    this._toastSuccess(successMsg);
                    resolve();
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing empty response.", error);
                    this._toastError(errorMsg);
                    resolve();
                });
        });
    }

    private _parseAsJson(response: Response) {
        if (!response.ok) {
            this._checkResponseCode(response);
        }
        return response.json();
    }

    // TODO: disable error toasts when no longer needed for testing.
    // eslint-disable-next-line complexity
    private _checkResponseCode(response: Response): void {
        switch (response.status) {
            case 400:
                // this.toast.error(i18n.t("itrex.badRequest"));
                throw new Error("Bad request error: " + response.status);
            case 404:
                // this.toast.error(i18n.t("itrex.notFound"));
                throw new Error("Not found error: " + response.status);
            case 500:
                // this.toast.error(i18n.t("itrex.internalServerError"));
                throw new Error("Internal server error: " + response.status);
            case 504:
                // this.toast.error(i18n.t("itrex.timeoutRequest"));
                throw new Error("Request timeout error: " + response.status);
            default:
                // this.toast.error(i18n.t("itrex.errorOccured"));
                throw new Error("HTTP error: " + response.status);
        }
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
