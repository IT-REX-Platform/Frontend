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
                    return response.json();
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
                .then((data) => {
                    const mappedCourses: ICourse[] = [];
                    data &&
                        data.forEach((course: ICourse) => {
                            const mappedCourse: ICourse = {
                                id: course.id,
                                courseDescription: course.courseDescription,
                                startDate: course.startDate ? new Date(course.startDate) : undefined,
                                endDate: course.endDate ? new Date(course.endDate) : undefined,
                                maxFoodSum: course.maxFoodSum,
                                publishState: course.publishState,
                                name: course.name,
                            };
                            mappedCourses.push(mappedCourse);
                        });
                    resolve(mappedCourses);
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
                        const json: unknown = response.json();
                        const video: IVideo = json as IVideo;
                        resolve(video);
                    } else {
                        createAlert(i18n.t("itrex.videoNotfound"));
                        ResponseParser.loggerApi.error("No video data received.");
                        resolve({});
                    }
                    return response.json();
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
                        const json: unknown = response.json();
                        const videos: IVideo[] = json as IVideo[];
                        resolve(videos);
                    } else {
                        createAlert(i18n.t("itrex.videosNotfound"));
                        ResponseParser.loggerApi.error("No videos data received.");
                        resolve([]);
                    }
                    return response.json();
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
