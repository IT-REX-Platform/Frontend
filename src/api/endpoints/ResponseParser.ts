import { loggerFactory } from "../../../logger/LoggerConfig";
import { createAlert } from "../../helperScripts/createAlert";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import i18n from "../../locales";
import { IChapter } from "../../types/IChapter";

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
                    courses.forEach((course: ICourse) => {
                        course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                        course.endDate = course.endDate ? new Date(course.endDate) : undefined;
                        course.chapterObjects = [];
                    });
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
                    if (response.ok) {
                        return response.json();
                    } else {
                        createAlert(i18n.t("itrex.chapterNotfound"));
                        ResponseParser.loggerApi.error("No course data received.");
                        resolve({});
                    }
                })
                .then((chapter: IChapter) => {
                    chapter.startDate = chapter.startDate ? new Date(chapter.startDate) : undefined;
                    chapter.endDate = chapter.endDate ? new Date(chapter.endDate) : undefined;
                    resolve(chapter);
                })
                .catch((error) => {
                    createAlert(i18n.t("itrex.chapterNotfound"));
                    ResponseParser.loggerApi.error("An error occurred while parsing course data.", error);
                    resolve({});
                });
        });
    }

    public static parseChapters(response: Promise<Response>): Promise<IChapter[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        createAlert(i18n.t("itrex.chaptersNotfound"));
                        ResponseParser.loggerApi.error("No courses data received.");
                        resolve([]);
                    }
                })
                .then((chapters: IChapter[]) => {
                    chapters.forEach((chapter: IChapter) => {
                        chapter.startDate = chapter.startDate ? new Date(chapter.startDate) : undefined;
                        chapter.endDate = chapter.endDate ? new Date(chapter.endDate) : undefined;
                    });
                    resolve(chapters);
                })
                .catch((error) => {
                    createAlert(i18n.t("itrex.chaptersNotfound"));
                    ResponseParser.loggerApi.error("An error occurred while parsing courses data.", error);
                    resolve([]);
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
                    videos.forEach((video: IVideo) => {
                        video.startDate = video.startDate ? new Date(video.startDate) : undefined;
                        video.endDate = video.endDate ? new Date(video.endDate) : undefined;
                    });
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
        switch (response.status) {
            case 400:
                createAlert(i18n.t("itrex.badRequest"));
                throw new Error("Bad request error: " + response.status);
            case 404:
                createAlert(i18n.t("itrex.notFound"));
                throw new Error("Not found error: " + response.status);
            case 500:
                createAlert(i18n.t("itrex.internalServerError"));
                throw new Error("Internal server error: " + response.status);
            case 504:
                createAlert(i18n.t("itrex.timeoutRequest"));
                throw new Error("Request timeout error: " + response.status);
            default:
                createAlert(i18n.t("itrex.errorOccured"));
                throw new Error("HTTP error: " + response.status);
        }
    }
}
