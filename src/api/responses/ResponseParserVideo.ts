import { IVideo } from "../../types/IVideo";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";
import { ResponseDate } from "./ResponseDate";

export class ResponseParserVideo {
    private loggerApi;
    private responseDate: ResponseDate;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserVideo");
        this.responseDate = new ResponseDate();
        this.responseToasts = new ResponseToasts();
    }

    public parseVideos(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IVideo[]> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    return this._parseAsJson(response) as Promise<IVideo[]>;
                })
                .then((videos: IVideo[]) => {
                    for (const video of videos) {
                        video.startDate = this.responseDate.parseDate(video.startDate);
                        video.endDate = this.responseDate.parseDate(video.endDate);
                    }

                    this.responseToasts.toastSuccess(successMsg);
                    resolve(videos);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing videos: " + error.message);
                    this.responseToasts.toastError(errorMsg);
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
                    return this._parseAsJson(response) as Promise<IVideo>;
                })
                .then((video: IVideo) => {
                    video.startDate = this.responseDate.parseDate(video.startDate);
                    video.endDate = this.responseDate.parseDate(video.endDate);
                    this.responseToasts.toastSuccess(successMsg, toastTimeout);
                    resolve(video);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing video: " + error.message);
                    this.responseToasts.toastError(errorMsg, toastTimeout);
                    resolve({});
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
                    return this._parseAsJson(response) as Promise<Map<string, IVideo>>;
                })
                .then((videoMap: Map<string, IVideo>) => {
                    videoMap = new Map(Object.entries(videoMap));

                    for (const [, video] of Array.from(videoMap.entries())) {
                        video.startDate = this.responseDate.parseDate(video.startDate);
                        video.endDate = this.responseDate.parseDate(video.endDate);
                    }

                    this.responseToasts.toastSuccess(successMsg);
                    resolve(videoMap);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing videos: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve(new Map<string, IVideo>());
                });
        });
    }

    private _parseAsJson(response: Response): Promise<IVideo[] | IVideo | Map<string, IVideo>> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
