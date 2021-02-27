import { loggerFactory } from "../../../logger/LoggerConfig";
import { createAlert } from "../../helperScripts/createAlert";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import i18n from "../../locales";

export class ResponseParser {
    private static loggerApi = loggerFactory.getLogger("API.ResponseParser");

    public static parseCourse(response: Promise<Response>): Promise<ICourse> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        createAlert(i18n.t("itrex.courseNotfound"));
                        ResponseParser.loggerApi.error("No course data received.");
                        resolve({});
                    }
                })
                .then((course: ICourse) => {
                    course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                    course.endDate = course.endDate ? new Date(course.endDate) : undefined;
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
                    if (response.ok) {
                        return response.json();
                    } else {
                        createAlert(i18n.t("itrex.coursesNotfound"));
                        ResponseParser.loggerApi.error("No courses data received.");
                        resolve([]);
                    }
                })
                .then((courses: ICourse[]) => {
                    courses.forEach((course: ICourse) => {
                        course.startDate = course.startDate ? new Date(course.startDate) : undefined;
                        course.endDate = course.endDate ? new Date(course.endDate) : undefined;
                    });
                    resolve(courses);
                })
                .catch((error) => {
                    ResponseParser.loggerApi.error("An error occurred while parsing courses data.", error);
                    resolve([]);
                });
        });
    }

    public static async parseVideo(response: Promise<Response>): Promise<IVideo> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        createAlert(i18n.t("itrex.videoNotFound"));
                        ResponseParser.loggerApi.error("No video data received.");
                        resolve({});
                    }
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
                    if (response.ok) {
                        return response.json();
                    } else {
                        createAlert(i18n.t("itrex.videosNotfound"));
                        ResponseParser.loggerApi.error("No videos data received.");
                        resolve([]);
                    }
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
}
