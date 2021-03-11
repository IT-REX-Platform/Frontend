import { loggerFactory } from "../../../logger/LoggerConfig";
import { ApiUrls } from "../../constants/ApiUrls";
import { itRexVars } from "../../constants/Constants";
import { IQuiz } from "../../types/IQuiz";
import { IEndpointsQuiz } from "../endpoints_interfaces/IEndpointsQuiz";
import { ResponseParser } from "./ResponseParser";

/**
 * Endpoints for mediaservice/api/videos.
 * Look in backend media-service VideoResource.java.
 */
export class EndpointsQuiz implements IEndpointsQuiz {
    private loggerApi = loggerFactory.getLogger("API.EndpointsVideo");
    private url: string;
    private responseParser: ResponseParser;

    public constructor() {
        this.url = itRexVars().apiUrl + ApiUrls.URL_QUIZZES;
        this.responseParser = new ResponseParser();
    }

    getAllQuizzes(
        getRequest: RequestInit,
        chapterId: string,
        successMsg?: string,
        errorMsg?: string
    ): Promise<IQuiz[]> {
        throw new Error("Method not implemented.");
    }

    getQuiz(getRequest: RequestInit, quizId: string, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        throw new Error("Method not implemented.");
    }

    createQuiz(postRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        throw new Error("Method not implemented.");
    }

    updateQuiz(putRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        throw new Error("Method not implemented.");
    }

    patchQuiz(patchRequest: RequestInit, successMsg?: string, errorMsg?: string): Promise<IQuiz> {
        throw new Error("Method not implemented.");
    }

    deleteQuiz(deleteRequest: RequestInit, quizId: string, successMsg?: string, errorMsg?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
