import { ICourse } from "../../types/ICourse";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";
import { ResponseDate } from "./ResponseDate";
import { Logger } from "typescript-logging";

export class ResponseParserCourse {
    private loggerApi: Logger;
    private responseDate: ResponseDate;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserCourse");
        this.responseDate = new ResponseDate();
        this.responseToasts = new ResponseToasts();
    }

    public parseCourses(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<ICourse[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<ICourse[]>;
                })
                .then((courses: ICourse[]) => {
                    for (const course of courses) {
                        course.startDate = this.responseDate.parseDate(course.startDate);
                        course.endDate = this.responseDate.parseDate(course.endDate);
                    }

                    this.responseToasts.toastSuccess(successMsg);
                    resolve(courses);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing courses: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve([]);
                });
        });
    }

    public parseCourse(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<ICourse> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<ICourse>;
                })
                .then((course: ICourse) => {
                    course.startDate = this.responseDate.parseDate(course.startDate);
                    course.endDate = this.responseDate.parseDate(course.endDate);

                    // Convert date of the TimePeriods
                    if (course.timePeriods != undefined) {
                        for (const timePeriod of course.timePeriods) {
                            timePeriod.startDate = this.responseDate.parseDate(timePeriod.startDate);
                            timePeriod.endDate = this.responseDate.parseDate(timePeriod.endDate);
                        }
                    }

                    this.responseToasts.toastSuccess(successMsg);
                    resolve(course);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing course: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve({});
                });
        });
    }

    private _parseAsJson(response: Response): Promise<ICourse[] | ICourse> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
