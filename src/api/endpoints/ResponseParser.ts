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
                        const json: unknown = response.json();
                        const course: ICourse = json as ICourse;
                        resolve(course);
                    } else {
                        createAlert(i18n.t("itrex.courseNotfound"));
                        ResponseParser.loggerApi.error("No course data received.");
                        resolve({});
                    }
                })
                .catch((error) => {
                    createAlert(i18n.t("itrex.courseNotfound"));
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
                        const json: unknown = response.json();
                        const courses: ICourse[] = json as ICourse[];
                        resolve(courses);
                    } else {
                        createAlert(i18n.t("itrex.coursesNotfound"));
                        ResponseParser.loggerApi.error("No courses data received.");
                        resolve([]);
                    }
                })
                .catch((error) => {
                    createAlert(i18n.t("itrex.coursesNotfound"));
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
                        const json: unknown = response.json();
                        const video: IVideo = json as IVideo;
                        resolve(video);
                    } else {
                        createAlert(i18n.t("itrex.videoNotfound"));
                        ResponseParser.loggerApi.error("No video data received.");
                        resolve({});
                    }
                })
                .catch((error) => {
                    createAlert(i18n.t("itrex.videoNotfound"));
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
                        const json: unknown = response.json();
                        const videos: IVideo[] = json as IVideo[];
                        resolve(videos);
                    } else {
                        createAlert(i18n.t("itrex.videosNotfound"));
                        ResponseParser.loggerApi.error("No videos data received.");
                        resolve([]);
                    }
                })
                .catch((error) => {
                    createAlert(i18n.t("itrex.videosNotfound"));
                    ResponseParser.loggerApi.error("An error occurred while parsing videos data.", error);
                    resolve([]);
                });
        });
    }
}
