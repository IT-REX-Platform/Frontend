import { loggerFactory } from "../../../logger/LoggerConfig";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { IUser } from "../../types/IUser";
import i18n from "../../locales";
import { IChapter } from "../../types/IChapter";
import { ToastService } from "../../services/toasts/ToastService";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";
import { ICourseProgressTracker } from "../../types/ICourseProgressTracker";

export class ResponseParser {
    private static loggerApi = loggerFactory.getLogger("API.ResponseParser");

    public static parseCourse(response: Promise<Response>): Promise<ICourse> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((course: ICourse) => {
                    course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                    course.endDate = course.endDate ? new Date(course.endDate) : undefined;
                    course.chapterObjects = [];
                    resolve(course);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing course data.", error);
                    resolve({});
                });
        });
    }

    public static parseCourses(response: Promise<Response>): Promise<ICourse[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
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
                    ResponseParser.loggerApi.error("An error occurred while parsing courses data.", error);
                    resolve([]);
                });
        });
    }

    public static parseChapter(response: Promise<Response>): Promise<IChapter> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((chapter: IChapter) => {
                    chapter.startDate = chapter.startDate ? new Date(chapter.startDate) : undefined;
                    chapter.endDate = chapter.endDate ? new Date(chapter.endDate) : undefined;
                    resolve(chapter);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing course data.", error);
                    resolve({});
                });
        });
    }

    public static parseChapters(response: Promise<Response>): Promise<IChapter[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((chapters: IChapter[]) => {
                    chapters.forEach((chapter: IChapter) => {
                        chapter.startDate = chapter.startDate ? new Date(chapter.startDate) : undefined;
                        chapter.endDate = chapter.endDate ? new Date(chapter.endDate) : undefined;
                    });
                    resolve(chapters);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing courses data.", error);
                    resolve([]);
                });
        });
    }

    public static async parseContentProgressTracker(response: Promise<Response>): Promise<IContentProgressTracker> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((contentProgressTracker: IContentProgressTracker) => {
                    if (contentProgressTracker.contentReference !== undefined) {
                        const ref = contentProgressTracker.contentReference;
                        ref.startDate = ref.startDate ? new Date(ref.startDate) : undefined;
                        ref.endDate = ref.endDate ? new Date(ref.endDate) : undefined;
                    }
                    resolve(contentProgressTracker);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing course data.", error);
                    resolve({});
                });
        });
    }

    public static async parseCourseProgressTracker(response: Promise<Response>): Promise<ICourseProgressTracker> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                // Still sorry, but..
                // eslint-disable-next-line complexity
                .then((courseProgressTracker: ICourseProgressTracker) => {
                    if (courseProgressTracker.contentProgressTrackers !== undefined) {
                        for (const curTracker of courseProgressTracker.contentProgressTrackers) {
                            if (curTracker.contentReference !== undefined) {
                                const ref = curTracker.contentReference;
                                ref.startDate = ref.startDate ? new Date(ref.startDate) : undefined;
                                ref.endDate = ref.endDate ? new Date(ref.endDate) : undefined;
                            }
                        }
                    }
                    resolve(courseProgressTracker);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing course data.", error);
                    resolve({});
                });
        });
    }

    public static async parseUserInfo(response: Promise<Response>): Promise<IUser> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((user: IUser) => {
                    resolve(user);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occured while parsing user data.", error);
                    resolve({});
                });
        });
    }

    public static async parseVideo(response: Promise<Response>): Promise<IVideo> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((video: IVideo) => {
                    video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                    video.endDate = video.endDate ? new Date(video.endDate) : undefined;
                    resolve(video);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing video data.", error);
                    resolve({});
                });
        });
    }

    public static async parseVideos(response: Promise<Response>): Promise<IVideo[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (!response.ok) {
                        ResponseParser._checkResponseCode(response);
                    }
                    return response.json();
                })
                .then((videos: IVideo[]) => {
                    for (const video of videos) {
                        video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                        video.endDate = video.endDate ? new Date(video.endDate) : undefined;
                    }
                    resolve(videos);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing videos data.", error);
                    resolve([]);
                });
        });
    }

    // eslint-disable-next-line complexity
    private static _checkResponseCode(response: Response): void {
        const toast: ToastService = new ToastService();

        switch (response.status) {
            case 400:
                toast.error(i18n.t("itrex.badRequest"));
                throw new Error("Bad request error: " + response.status);
            case 404:
                toast.error(i18n.t("itrex.notFound"));
                throw new Error("Not found error: " + response.status);
            case 500:
                toast.error(i18n.t("itrex.internalServerError"));
                throw new Error("Internal server error: " + response.status);
            case 504:
                toast.error(i18n.t("itrex.timeoutRequest"));
                throw new Error("Request timeout error: " + response.status);
            default:
                toast.error(i18n.t("itrex.errorOccured"));
                throw new Error("HTTP error: " + response.status);
        }
    }
}
