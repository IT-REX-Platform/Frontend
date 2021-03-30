import { IUser } from "../../types/IUser";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { ResponseToasts } from "./ResponseToasts";

export class ResponseParserUserInfo {
    private loggerApi;
    private responseToasts: ResponseToasts;

    constructor() {
        this.loggerApi = loggerFactory.getLogger("API.ResponseParserUserInfo");
        this.responseToasts = new ResponseToasts();
    }

    public parseUserInfo(response: Promise<Response>, successMsg?: string, errorMsg?: string): Promise<IUser> {
        return new Promise((resolve) => {
            response
                .then((response) => {
                    const user = this._parseAsJson(response) as Promise<IUser>;
                    this.responseToasts.toastSuccess(successMsg);
                    resolve(user);
                })
                .catch((error) => {
                    this.loggerApi.error("An error occurred while parsing user info: " + error.message);
                    this.responseToasts.toastError(errorMsg);
                    resolve({});
                });
        });
    }

    private _parseAsJson(response: Response): Promise<IUser> {
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        return response.json();
    }
}
