import { loggerFactory } from "../../../logger/LoggerConfig";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { IUser } from "../../types/IUser";
import i18n from "../../locales";
import { IChapter } from "../../types/IChapter";
import { ToastService } from "../../services/toasts/ToastService";

export class ResponseParser {
    private loggerApi;
    private toast: ToastService;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParser");
        this.toast = new ToastService();
    }

    public parseCourse(response: Promise<Response>): Promise<ICourse> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((course: ICourse) => {
                    course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                    course.endDate = course.endDate ? new Date(course.endDate) : undefined;
                    course.chapterObjects = [];
                    resolve(course);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing course.", error);
                    reject(new Error("An error occurred while parsing course."));
                });
        });
    }

    public parseCourses(response: Promise<Response>): Promise<ICourse[]> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((courses: ICourse[]) => {
                    for (const course of courses) {
                        course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                        course.endDate = course.endDate ? new Date(course.endDate) : undefined;
                        course.chapterObjects = [];
                    }
                    resolve(courses);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing courses.", error);
                    reject(new Error("An error occurred while parsing courses."));
                });
        });
    }

    public parseChapter(response: Promise<Response>): Promise<IChapter> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((chapter: IChapter) => {
                    chapter.startDate = chapter.startDate ? new Date(chapter.startDate) : undefined;
                    chapter.endDate = chapter.endDate ? new Date(chapter.endDate) : undefined;
                    resolve(chapter);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapter.", error);
                    reject(new Error("An error occurred while parsing chapter."));
                });
        });
    }

    public parseChapters(response: Promise<Response>): Promise<IChapter[]> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((chapters: IChapter[]) => {
                    chapters.forEach((chapter: IChapter) => {
                        chapter.startDate = chapter.startDate ? new Date(chapter.startDate) : undefined;
                        chapter.endDate = chapter.endDate ? new Date(chapter.endDate) : undefined;
                    });
                    resolve(chapters);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing chapters.", error);
                    reject(new Error("An error occurred while parsing chapters."));
                });
        });
    }

    public parseUserInfo(response: Promise<Response>): Promise<IUser> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((user: IUser) => {
                    resolve(user);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing user info.", error);
                    reject(new Error("An error occurred while parsing user info."));
                });
        });
    }

    public parseVideo(response: Promise<Response>): Promise<IVideo> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((video: IVideo) => {
                    video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                    video.endDate = video.endDate ? new Date(video.endDate) : undefined;
                    resolve(video);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing video.", error);
                    reject(new Error("An error occurred while parsing video."));
                });
        });
    }

    public parseVideos(response: Promise<Response>): Promise<IVideo[]> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    return this._parseAsJson(response);
                })
                .then((videos: IVideo[]) => {
                    for (const video of videos) {
                        video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                        video.endDate = video.endDate ? new Date(video.endDate) : undefined;
                    }
                    resolve(videos);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing videos.", error);
                    reject(new Error("An error occurred while parsing videos."));
                });
        });
    }

    public checkEmptyResponse(response: Promise<Response>): Promise<void> {
        return new Promise((resolve, reject) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        this._checkResponseCode(response);
                    }
                    resolve();
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing empty response.", error);
                    reject(new Error("An error occurred while parsing empty response."));
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
                this.toast.error(i18n.t("itrex.badRequest"));
                throw new Error("Bad request error: " + response.status);
            case 404:
                this.toast.error(i18n.t("itrex.notFound"));
                throw new Error("Not found error: " + response.status);
            case 500:
                this.toast.error(i18n.t("itrex.internalServerError"));
                throw new Error("Internal server error: " + response.status);
            case 504:
                this.toast.error(i18n.t("itrex.timeoutRequest"));
                throw new Error("Request timeout error: " + response.status);
            default:
                this.toast.error(i18n.t("itrex.errorOccured"));
                throw new Error("HTTP error: " + response.status);
        }
    }
}
